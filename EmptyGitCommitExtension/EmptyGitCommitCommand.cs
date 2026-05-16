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

            string workspaceDirectory = "C:\\TEMP\\"; // Replace with dynamic workspace retrieval logic
            EmptyCommitWorkflow.RunCommitWorkflow(package, workspaceDirectory);
        }
    }
}