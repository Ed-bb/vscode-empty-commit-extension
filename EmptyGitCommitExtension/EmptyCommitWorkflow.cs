using System;
using Microsoft.VisualStudio.Shell;

namespace EmptyGitCommitExtension
{
    internal static class EmptyCommitWorkflow
    {
        public static void RunCommitWorkflow(AsyncPackage package, string directory)
        {
            ThreadHelper.ThrowIfNotOnUIThread();

            try
            {
                // Ensure Git is installed
                if (!GitUtility.IsGitInstalled())
                {
                    ShowError(package, "Git is not installed or not available in the system PATH.");
                    return;
                }

                // Ensure current directory is a Git repository
                if (!GitUtility.IsGitRepository(directory))
                {
                    ShowError(package, "The current workspace is not a Git repository.");
                    return;
                }

                string gitCommand = "git commit --allow-empty -m \"Empty Commit\"";
                GitUtility.ExecuteGitCommand(gitCommand, directory);
                ShowSuccess(package, "Empty Git commit created successfully!");
            }
            catch (Exception ex)
            {
                ShowError(package, ex.Message);
            }
        }

        private static void ShowError(AsyncPackage package, string message)
        {
            VsShellUtilities.ShowMessageBox(package, message, "Error", OLEMSGICON.OLEMSGICON_CRITICAL, OLEMSGBUTTON.OLEMSGBUTTON_OK, OLEMSGDEFBUTTON.OLEMSGDEFBUTTON_FIRST);
        }

        private static void ShowSuccess(AsyncPackage package, string message)
        {
            VsShellUtilities.ShowMessageBox(package, message, "Success", OLEMSGICON.OLEMSGICON_INFO, OLEMSGBUTTON.OLEMSGBUTTON_OK, OLEMSGDEFBUTTON.OLEMSGDEFBUTTON_FIRST);
        }
    }
}