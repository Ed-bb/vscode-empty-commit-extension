using System.Diagnostics;
using Microsoft.VisualStudio.Shell;
using System;
using System.Runtime.InteropServices;

namespace EmptyGitCommitExtension
{
    [ProvideMenuResource("Menus.ctmenu", 1)]
    [PackageRegistration(UseManagedResourcesOnly = true, AllowsBackgroundLoading = true)]
    [Guid(PackageGuidString)]
    public sealed class EmptyGitCommitExtensionPackage : AsyncPackage
    {
        public const string PackageGuidString = "d213f8da-b8da-4c64-8dbb-8daa8f92a7e1";

        protected override System.Threading.Tasks.Task InitializeAsync(System.Threading.CancellationToken cancellationToken, IProgress<ServiceProgressData> progress)
        {
            // Initialize commands
            EmptyGitCommitCommand.Initialize(this);
            return base.InitializeAsync(cancellationToken, progress);
        }
    }
}