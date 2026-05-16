using System;
using System.Diagnostics;
using Microsoft.VisualStudio.Shell;

namespace EmptyGitCommitExtension
{
    internal static class GitUtility
    {
        // Check if Git is installed
        public static bool IsGitInstalled()
        {
            try
            {
                using var process = StartProcess("git", "--version");
                process.WaitForExit();
                return process.ExitCode == 0;
            }
            catch
            {
                return false;
            }
        }

        // Check if the current directory is a Git repository
        public static bool IsGitRepository(string directory)
        {
            try
            {
                using var process = StartProcess("git", "rev-parse --is-inside-work-tree", directory);
                process.WaitForExit();
                return process.ExitCode == 0;
            }
            catch
            {
                return false;
            }
        }

        // Run a Git command and return output or error
        public static void ExecuteGitCommand(string command, string directory)
        {
            using var process = StartProcess("cmd.exe", $"/c {command}", directory);

            process.WaitForExit();

            if (process.ExitCode != 0)
            {
                string error = process.StandardError.ReadToEnd();
                throw new Exception(error);
            }
        }

        // Start a process for a given command
        private static Process StartProcess(string fileName, string arguments, string workingDirectory = "")
        {
            var startInfo = new ProcessStartInfo(fileName, arguments)
            {
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true,
                WorkingDirectory = workingDirectory
            };

            return Process.Start(startInfo);
        }
    }
}