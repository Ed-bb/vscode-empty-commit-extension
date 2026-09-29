import * as vscode from 'vscode';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

// Helper function to get workspace folder with user selection if multiple exist
async function getWorkspaceFolder(): Promise<vscode.WorkspaceFolder | null> {
  const folders = vscode.workspace.workspaceFolders;

  if (!folders || folders.length === 0) {
    vscode.window.showErrorMessage('No workspace folder open. Please open a folder first.');
    return null;
  }

  if (folders.length === 1) {
    return folders[0];
  }

  // Multiple folders: let user choose
  const selected = await vscode.window.showQuickPick(
    folders.map((f) => ({ label: f.name, folder: f })),
    { placeHolder: 'Select workspace folder' }
  );

  return selected?.folder || null;
}

// Helper function to validate if a folder is a git repository
async function isGitRepository(cwd: string): Promise<boolean> {
  try {
    await execFileAsync('git', ['rev-parse', '--git-dir'], { cwd });
    return true;
  } catch {
    return false;
  }
}

// Helper function to format git error messages
function formatGitError(error: any): string {
  if (error.stderr) {
    const stderr = error.stderr.toString().trim();
    if (stderr.includes('not a git repository')) {
      return 'Not a git repository. Initialize first using "Empty Commit: Initialize Repository"';
    }
    if (stderr.includes('fatal')) {
      return stderr.replace('fatal: ', '');
    }
    return stderr;
  }
  return error.message || 'Unknown git error';
}

// Helper function to create an empty commit
async function createEmptyCommit(cwd: string, message: string): Promise<void> {
  try {
    await execFileAsync('git', ['commit', '--allow-empty', '-m', message], { cwd });
  } catch (error: any) {
    throw new Error(formatGitError(error));
  }
}

export function activate(context: vscode.ExtensionContext) {
  // Command 1: Quick empty commit - THE PRIMARY COMMAND FOR INITIALIZING REPOS
  // This should be bound to Ctrl+Shift+E for fastest access
  const quickEmptyCommit = vscode.commands.registerCommand(
    'empty-commit.quick',
    async () => {
      try {
        const folder = await getWorkspaceFolder();
        if (!folder) return;

        const cwd = folder.uri.fsPath;
        const isGit = await isGitRepository(cwd);

        // If not a git repo, auto-initialize it
        if (!isGit) {
          try {
            await execFileAsync('git', ['init'], { cwd });
          } catch (error: any) {
            vscode.window.showErrorMessage(`Failed to initialize git: ${formatGitError(error)}`);
            return;
          }
        }

        // Create empty commit with default message
        try {
          await createEmptyCommit(cwd, 'Empty commit');
          vscode.window.showInformationMessage('✓ Empty commit created');
        } catch (error: any) {
          vscode.window.showErrorMessage(`Failed to create commit: ${error.message}`);
        }
      } catch (error: any) {
        vscode.window.showErrorMessage(`Operation failed: ${error.message}`);
      }
    }
  );

  // Command 2: Create empty commit with custom message
  // For users who want to specify what the commit is for
  const customEmptyCommit = vscode.commands.registerCommand(
    'empty-commit.custom',
    async () => {
      try {
        const folder = await getWorkspaceFolder();
        if (!folder) return;

        const cwd = folder.uri.fsPath;
        const isGit = await isGitRepository(cwd);

        // If not a git repo, offer to initialize
        if (!isGit) {
          const action = await vscode.window.showQuickPick(
            [
              { label: 'Initialize Repository', description: 'Create git repo and commit' },
              { label: 'Cancel', description: 'Do nothing' }
            ],
            { placeHolder: 'Not a git repository' }
          );

          if (action?.label !== 'Initialize Repository') return;

          try {
            await execFileAsync('git', ['init'], { cwd });
          } catch (error: any) {
            vscode.window.showErrorMessage(`Failed to initialize git: ${formatGitError(error)}`);
            return;
          }
        }

        // Prompt for commit message
        const message = await vscode.window.showInputBox({
          prompt: 'Commit message for empty commit',
          value: 'Empty commit',
          placeHolder: 'e.g., "chore: initialize repo" or "init: setup"',
          validateInput: (value) => {
            if (!value.trim()) {
              return 'Message cannot be empty';
            }
            return '';
          }
        });

        if (!message) return;

        try {
          await createEmptyCommit(cwd, message);
          vscode.window.showInformationMessage(`✓ Commit created: "${message}"`);
        } catch (error: any) {
          vscode.window.showErrorMessage(`Failed to create commit: ${error.message}`);
        }
      } catch (error: any) {
        vscode.window.showErrorMessage(`Operation failed: ${error.message}`);
      }
    }
  );

  // Command 3: Initialize repository and create initial commit
  // For users who want to set git config before creating the first commit
  const initRepository = vscode.commands.registerCommand(
    'empty-commit.init',
    async () => {
      try {
        const folder = await getWorkspaceFolder();
        if (!folder) return;

        const cwd = folder.uri.fsPath;
        const isGit = await isGitRepository(cwd);

        // Initialize git if needed
        if (!isGit) {
          try {
            await execFileAsync('git', ['init'], { cwd });
            vscode.window.showInformationMessage('✓ Git repository initialized');
          } catch (error: any) {
            vscode.window.showErrorMessage(`Failed to initialize git: ${formatGitError(error)}`);
            return;
          }
        }

        // Ask if user wants to configure git user
        const configGit = await vscode.window.showQuickPick(
          [
            { label: 'Yes', description: 'Set git user name and email' },
            { label: 'No', description: 'Skip configuration' }
          ],
          {
            placeHolder: 'Configure git user (name/email)?',
            canPickMany: false
          }
        );

        if (configGit?.label === 'Yes') {
          const userName = await vscode.window.showInputBox({
            prompt: 'Git user name',
            placeHolder: 'e.g., John Doe',
            validateInput: (value) => {
              if (!value.trim()) {
                return 'Name cannot be empty';
              }
              return '';
            }
          });

          if (!userName) return;

          const userEmail = await vscode.window.showInputBox({
            prompt: 'Git user email',
            placeHolder: 'e.g., john@example.com',
            validateInput: (value) => {
              if (!value.trim()) {
                return 'Email cannot be empty';
              }
              if (!value.includes('@')) {
                return 'Please enter a valid email';
              }
              return '';
            }
          });

          if (!userEmail) return;

          try {
            await execFileAsync('git', ['config', 'user.name', userName], { cwd });
            await execFileAsync('git', ['config', 'user.email', userEmail], { cwd });
            vscode.window.showInformationMessage('✓ Git user configured');
          } catch (error: any) {
            vscode.window.showErrorMessage(`Failed to configure git: ${formatGitError(error)}`);
            return;
          }
        }

        // Create initial commit
        const message = await vscode.window.showInputBox({
          prompt: 'Initial commit message',
          value: 'Initial commit',
          placeHolder: 'e.g., "Initial commit" or "chore: setup"',
          validateInput: (value) => {
            if (!value.trim()) {
              return 'Message cannot be empty';
            }
            return '';
          }
        });

        if (!message) return;

        try {
          await createEmptyCommit(cwd, message);
          vscode.window.showInformationMessage(`✓ Repository initialized with commit: "${message}"`);
        } catch (error: any) {
          vscode.window.showErrorMessage(`Failed to create commit: ${error.message}`);
        }
      } catch (error: any) {
        vscode.window.showErrorMessage(`Operation failed: ${error.message}`);
      }
    }
  );

  context.subscriptions.push(quickEmptyCommit, customEmptyCommit, initRepository);
}

export function deactivate() {}
