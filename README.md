# VS Code Empty Commit Extension

This VS Code extension adds commands to create empty git commits for the active workspace repository.

## Features
- **Create Empty Commit:** Prompts you for a commit message, creates an empty commit.
- **Create Empty Commit (Quick):** Instantly creates an empty commit with the message "Empty commit".

## Usage
1. Open a workspace folder that is a git repository.
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P`) and run:
    - `Create Empty Commit` — choose your commit message.
    - `Create Empty Commit (Quick)` — uses default message.
3. Check your git log for the new empty commit.

## Commands
- `empty-commit.create` — asks for a message, creates empty commit
- `empty-commit.createQuick` — creates with message "Empty commit"

## Equivalent Command
This extension runs the following git command in your workspace:

```
git commit --allow-empty -m "Your message"
```

## Development
- Build: `npm run compile`
- Test: Press **F5** in VS Code (Extension Development Host)
- Publish: `vsce package` / `vsce publish`

---
MIT License
