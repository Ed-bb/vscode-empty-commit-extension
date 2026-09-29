import * as vscode from 'vscode';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

// Helper function to get workspace folder with user selection if multiple exist
async function getWorkspaceFolder(): Promise<vscode.WorkspaceFolder | null> {
  const folders = vscode.workspace.workspaceFolders;

  if (!folders || folders.length === 0) {
    vscode.window.showErrorMessage('No workspace folder open');
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
      return 'Not a git repository. Run "Initialize Repository with Empty Commit" first.';
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

// Initialize a repository (git init + optional user config + empty commit)
async function initializeRepository(cwd: string): Promise<void> {
  try {
    const isGit = await isGitRepository(cwd);

    if (!isGit) {
      // Initialize git repo
      await execFileAsync('git', ['init'], { cwd });
      vscode.window.showInformationMessage('✓ Git repository initialized');
    }

    // Ask if user wants to configure git user
    const configure = await vscode.window.showQuickPick(['Yes', 'No'], {
      placeHolder: 'Configure git user (name/email) before creating commit?'
    });

    if (configure === 'Yes') {
      const userName = await vscode.window.showInputBox({
        prompt: 'Enter git user name',
        validateInput: (value) => (value.trim() ? '' : 'Name cannot be empty')
      });

      if (!userName) return;

      const userEmail = await vscode.window.showInputBox({
        prompt: 'Enter git user email',
        validateInput: (value) =>
          value.includes('@') ? '' : 'Please enter a valid email'
      });

      if (!userEmail) return;

      try {
        await execFileAsync('git', ['config', 'user.name', userName], { cwd });
        await execFileAsync('git', ['config', 'user.email', userEmail], { cwd });
        vscode.window.showInformationMessage('✓ Git user configured');
      } catch (error: any) {
        vscode.window.showErrorMessage(`Failed to configure git user: ${formatGitError(error)}`);
        return;
      }
    }

    // Create initial empty commit
    const message = await vscode.window.showInputBox({
      prompt: 'Enter initial commit message',
      value: 'Initial commit',
      validateInput: (value) => (value.trim() ? '' : 'Message cannot be empty')
    });

    if (!message) return;

    await createEmptyCommit(cwd, message);
    vscode.window.showInformationMessage(`✓ Repository initialized with commit: "${message}"`);
  } catch (error: any) {
    vscode.window.showErrorMessage(`Failed to initialize repository: ${error.message}`);
  }
}

export function activate(context: vscode.ExtensionContext) {
  // Command 1: Create empty commit with custom message
  const createEmptyCommit_cmd = vscode.commands.registerCommand(
    'empty-commit.create',
    async () => {
      try {
        const folder = await getWorkspaceFolder();
        if (!folder) return;

        const isGit = await isGitRepository(folder.uri.fsPath);
        if (!isGit) {
          const init = await vscode.window.showQuickPick(['Initialize Now', 'Cancel'], {
            placeHolder: 'Not a git repository. Initialize?'
          });
          if (init !== 'Initialize Now') return;
          await initializeRepository(folder.uri.fsPath);
          return;
        }

        const message = await vscode.window.showInputBox({
          prompt: 'Enter commit message',
          value: 'Empty commit',
          validateInput: (value) => (value.trim() ? '' : 'Message cannot be empty')
        });

        if (!message) return;

        const cwd = folder.uri.fsPath;
        await createEmptyCommit(cwd, message);
        vscode.window.showInformationMessage(`✓ Empty commit created: "${message}"`);
      } catch (error: any) {
        vscode.window.showErrorMessage(`Failed to create commit: ${error.message}`);
      }
    }
  );

  // Command 2: Create empty commit with default message
  const createWithoutPrompt = vscode.commands.registerCommand(
    'empty-commit.createQuick',
    async () => {
      try {
        const folder = await getWorkspaceFolder();
        if (!folder) return;

        const isGit = await isGitRepository(folder.uri.fsPath);
        if (!isGit) {
          const init = await vscode.window.showQuickPick(['Initialize Now', 'Cancel'], {
            placeHolder: 'Not a git repository. Initialize?'
          });
          if (init !== 'Initialize Now') return;
          await initializeRepository(folder.uri.fsPath);
          return;
        }

        const cwd = folder.uri.fsPath;
        await createEmptyCommit(cwd, 'Empty commit');
        vscode.window.showInformationMessage('✓ Empty commit created');
      } catch (error: any) {
        vscode.window.showErrorMessage(`Failed to create commit: ${error.message}`);
      }
    }
  );

  // Command 3: Initialize repository with empty commit
  const initRepo = vscode.commands.registerCommand('empty-commit.initRepo', async () => {
    try {
      const folder = await getWorkspaceFolder();
      if (!folder) return;

      await initializeRepository(folder.uri.fsPath);
    } catch (error: any) {
      vscode.window.showErrorMessage(`Failed to initialize repository: ${error.message}`);
    }
  });

  context.subscriptions.push(createEmptyCommit_cmd, createWithoutPrompt, initRepo);
}

export function deactivate() {}