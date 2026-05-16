using System;
using System.ComponentModel.Design;
using Microsoft.VisualStudio.Shell;
using Task = System.Threading.Tasks.Task;

namespace EmptyGitCommitExtension
{
    internal sealed class EmptyGitCommitCommand
    {
        public const int CommandId = 0x0100;
        public static readonly Guid CommandSet = new Guid("824b05b3-d6df-4477-8b22-3df7b10c1dfd");
        private readonly AsyncPackage package;

        private EmptyGitCommitCommand(AsyncPackage package, OleMenuCommandService commandService)
        {
            this.package = package;
            var menuCommandId = new CommandID(CommandSet, CommandId);
            var menuItem = new MenuCommand(this.Execute, menuCommandId);
            commandService.AddCommand(menuItem);
        }

        public static async Task InitializeAsync(AsyncPackage package)
        {
            // Switch to the main thread - required by VS SDK for interacting with UI elements
            await ThreadHelper.JoinableTaskFactory.SwitchToMainThreadAsync(package.DisposalToken);
            var commandService = await package.GetServiceAsync(typeof(IMenuCommandService)) as OleMenuCommandService;
            new EmptyGitCommitCommand(package, commandService);
        }

        private void Execute(object sender, EventArgs e)
        {
            ThreadHelper.ThrowIfNotOnUIThread();
            string gitCommand = "git commit --allow-empty -m \"Empty Commit\"";

            try
            {
                ExecuteGitCommand(gitCommand);
                VsShellUtilities.ShowMessageBox(
                    this.package,
                    "Empty Git Commit Created Successfully!",
                    "Success",
                    OLEMSGICON.OLEMSGICON_INFO,
                    OLEMSGBUTTON.OLEMSGBUTTON_OK,
                    OLEMSGDEFBUTTON.OLEMSGDEFBUTTON_FIRST);
            }
            catch (Exception ex)
            {
                VsShellUtilities.ShowMessageBox(
                    this.package,
                    ex.Message,
                    "Error",
                    OLEMSGICON.OLEMSGICON_CRITICAL,
                    OLEMSGBUTTON.OLEMSGBUTTON_OK,
                    OLEMSGDEFBUTTON.OLEMSGDEFBUTTON_FIRST);
            }
        }

        private void ExecuteGitCommand(string command)
        {
            var info = new ProcessStartInfo("cmd.exe", "/c " + command)
            {
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true,
            };

            using var process = Process.Start(info);
            process.WaitForExit();

            if (process.ExitCode != 0)
            {
                throw new Exception(process.StandardError.ReadToEnd());
            }
        }
    }
}