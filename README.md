# VS Code Empty Commit Extension

A lightweight VS Code extension that simplifies creating empty git commits. Perfect for initializing repositories, branches, and triggering CI/CD pipelines without code changes.

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- **Create Empty Commit** — Prompts for a custom commit message and creates an empty commit
- **Create Empty Commit (Quick)** — Instantly creates an empty commit with the message "Empty commit"
- **Initialize Repository** — Initialize a new git repository with optional user configuration and an initial empty commit
- **Multi-folder Support** — Choose which workspace folder to commit to when multiple folders are open
- **Smart Validation** — Validates git repository status and prevents empty commit messages

## 🚀 Quick Start

### Installation

1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X` / `Cmd+Shift+X`)
3. Search for "Empty Commit Extension"
4. Click **Install**

Or install from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/) (when published)

### Basic Usage

1. Open a workspace folder that is a git repository
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P`) to open the Command Palette
3. Run one of these commands:
   - **`Create Empty Commit`** — Create with custom message
   - **`Create Empty Commit (Quick)`** — Create with default message
   - **`Initialize Repository with Empty Commit`** — Set up a new repo

## ⌨️ Keyboard Shortcuts

| Action | Windows/Linux | macOS |
|--------|---------------|-------|
| Quick empty commit | `Ctrl+Shift+E` | `Cmd+Shift+E` |
| Custom message commit | `Ctrl+Shift+Alt+E` | `Cmd+Shift+Alt+E` |

*Note: Shortcuts work when the Explorer view is focused*

## 💡 Use Cases

### Initialize a New Repository

```bash
# Without this extension, you'd need:
git init
git config user.name "Your Name"
git config user.email "your.email@example.com"
git commit --allow-empty -m "Initial commit"
```

**With this extension:** Run "Initialize Repository with Empty Commit" and follow the prompts!

### Trigger CI/CD Without Code Changes

Many CI/CD pipelines are triggered by git commits. Use this extension to:
- Trigger GitHub Actions workflows
- Run GitLab CI pipelines
- Deploy without code modifications

Simply create an empty commit with a meaningful message:
```
git commit --allow-empty -m "chore: trigger CI/CD pipeline"
```

### Initialize Feature Branches

```bash
git checkout -b feature/my-feature
# Create an empty commit to establish the branch
git commit --allow-empty -m "init: feature/my-feature"
```

## 🔧 Commands

| Command | ID | Description |
|---------|----|--------------|
| Create Empty Commit | `empty-commit.create` | Prompts for message, creates empty commit |
| Create Empty Commit (Quick) | `empty-commit.createQuick` | Creates with message "Empty commit" |
| Initialize Repository | `empty-commit.initRepo` | Initializes git repo with optional user config |

## 📋 Requirements

- VS Code 1.75.0 or higher
- Git must be installed and available in your system PATH
- A workspace folder to work with

## ⚙️ How It Works

This extension runs the equivalent of:

```bash
git commit --allow-empty -m "Your message"
```

For repository initialization, it also supports:

```bash
git init
git config user.name "Name"
git config user.email "email@example.com"
```

## 🐛 Troubleshooting

### "No workspace folder open"

**Problem:** Extension shows this error message

**Solution:** Open a folder in VS Code first (`File > Open Folder` or `Ctrl+K Ctrl+O`)

### "Not a git repository"

**Problem:** You get this error when trying to create a commit

**Solutions:**
1. **Option A:** Use "Initialize Repository with Empty Commit" command to set up git
2. **Option B:** Run `git init` in your terminal manually, then try again
3. **Option C:** Open an existing git repository folder

### Command not appearing in Command Palette

**Problem:** Commands don't show up in Command Palette

**Solutions:**
- Ensure the folder is a git repository (or use Initialize command first)
- Try reloading VS Code (`Ctrl+Shift+P` → "Reload Window")
- Check that the extension is enabled in Extensions view

### Git command not found

**Problem:** You see "git is not recognized" or "git: command not found"

**Solutions:**
1. **Windows:** Install [Git for Windows](https://git-scm.com/download/win)
2. **macOS:** Install via Homebrew: `brew install git`
3. **Linux:** `sudo apt-get install git` (Ubuntu/Debian) or equivalent for your distro
4. Ensure git is in your system PATH
5. Restart VS Code after installing git

### Permission denied

**Problem:** You see permission-related errors on macOS/Linux

**Solution:** Check file permissions:
```bash
chmod 755 /path/to/your/repo
```

## 👨‍💻 Development

### Build
```bash
npm run compile
```

### Watch mode
```bash
npm run watch
```

### Lint
```bash
npm run lint
npm run lint:fix  # Auto-fix issues
```

### Test
1. Press `F5` in VS Code to open Extension Development Host
2. Test the commands in the new window

### Publish
```bash
vsce publish
```

## 📦 Project Structure

```
├── src/
│   └── extension.ts       # Main extension code
├── package.json           # Extension manifest
├── tsconfig.json          # TypeScript config
├── .eslintrc.json         # Linting rules
├── .gitignore             # Git ignore patterns
├── .vscodeignore          # Package ignore patterns
└── README.md              # This file
```

## 📄 License

MIT License — feel free to use and modify!

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs via GitHub Issues
- Suggest features
- Submit pull requests

## 🔐 Security

This extension uses secure argument passing to git commands to prevent shell injection vulnerabilities. All user input is properly validated.

## 📞 Support

For issues, questions, or feature requests, please open an issue on the [GitHub repository](https://github.com/Ed-bb/vscode-empty-commit-extension).

---

**Happy committing!** 🎉
