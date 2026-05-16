import * as vscode from 'vscode';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Utility to check if the current workspace is a Git repository.
 */
async function isGitRepository(cwd: string): Promise<boolean> {
    try {
        await execAsync('git rev-parse --is-inside-work-tree', { cwd });
        return true;
    } catch {
        return false;
    }
}

/**
 * Utility to execute a Git command and handle errors.
 */
async function executeGitCommand(command: string, cwd: string): Promise<void> {
    try {
        await execAsync(command, { cwd });
    } catch (error: any) {
        throw new Error(`Git command failed: ${error.message}`);
    }
}

/**
 * Entry point of the extension, registering commands to the VS Code API.
 */
export function activate(context: vscode.ExtensionContext) {
    // Default commit message from settings or fallback
    const defaultCommitMessage = vscode.workspace.getConfiguration('emptyCommit').get<string>('defaultMessage') || 'Empty commit';

    /** Command: Create Empty Commit with a custom message */
    const createEmptyCommit = vscode.commands.registerCommand('empty-commit.create', async () => {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('No workspace folder open');
            return;
        }

        const cwd = workspaceFolder.uri.fsPath;
        if (!(await isGitRepository(cwd))) {
            vscode.window.showErrorMessage('No Git repository found in the current workspace');
            return;
        }

        const message = await vscode.window.showInputBox({
            prompt: 'Enter commit message',
            value: defaultCommitMessage,
        });

        if (!message) {
            vscode.window.showErrorMessage('Commit message cannot be empty');
            return;
        } else if (message.length > 72) {
            vscode.window.showErrorMessage('Commit message is too long. Keep it under 72 characters.');
            return;
        }

        try {
            await executeGitCommand(`git commit --allow-empty -m "${message.replace(/"/g, '\"')}"`, cwd);
            vscode.window.showInformationMessage(`✓ Empty commit created: "${message}"`);
        } catch (error: any) {
            vscode.window.showErrorMessage(error.message);
        }
    });

    /** Command: Create Empty Commit with a default message */
    const createWithoutPrompt = vscode.commands.registerCommand('empty-commit.createQuick', async () => {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('No workspace folder open');
            return;
        }

        const cwd = workspaceFolder.uri.fsPath;
        if (!(await isGitRepository(cwd))) {
            vscode.window.showErrorMessage('No Git repository found in the current workspace');
            return;
        }

        try {
            await executeGitCommand(`git commit --allow-empty -m "${defaultCommitMessage}"`, cwd);
            vscode.window.showInformationMessage(`✓ Empty commit created with default message: "${defaultCommitMessage}"`);
        } catch (error: any) {
            vscode.window.showErrorMessage(error.message);
        }
    });

    context.subscriptions.push(createEmptyCommit, createWithoutPrompt);
}

export function deactivate() {}
