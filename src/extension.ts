import * as vscode from 'vscode';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export function activate(context: vscode.ExtensionContext) {
  const createEmptyCommit = vscode.commands.registerCommand(
    'empty-commit.create',
    async () => {
      try {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
          vscode.window.showErrorMessage('No workspace folder open');
          return;
        }

        const message = await vscode.window.showInputBox({
          prompt: 'Enter commit message',
          value: 'Empty commit'
        });

        if (!message) return;

        const cwd = workspaceFolder.uri.fsPath;
        await execAsync(`git commit --allow-empty -m "${message.replace(/"/g, '\"')}"`, { cwd });

        vscode.window.showInformationMessage(`✓ Empty commit created: "${message}"`);
      } catch (error: any) {
        vscode.window.showErrorMessage(`Failed to create commit: ${error.message}`);
      }
    }
  );

  const createWithoutPrompt = vscode.commands.registerCommand(
    'empty-commit.createQuick',
    async () => {
      try {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
          vscode.window.showErrorMessage('No workspace folder open');
          return;
        }

        const cwd = workspaceFolder.uri.fsPath;
        await execAsync(`git commit --allow-empty -m "Empty commit"`, { cwd });
        vscode.window.showInformationMessage('✓ Empty commit created');
      } catch (error: any) {
        vscode.window.showErrorMessage(`Failed to create commit: ${error.message}`);
      }
    }
  );

  context.subscriptions.push(createEmptyCommit, createWithoutPrompt);
}

export function deactivate() {}
