# Empty Commit

A lightning-fast VS Code extension for initializing repositories with empty commits. **One keystroke after forking a repo = instant setup.**

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎯 Perfect For

- **Just forked a repo?** Press `Ctrl+Shift+E` to initialize it instantly
- **Created a new branch?** Quick empty commit to establish it
- **Triggering CI/CD?** Create a commit without code changes

## ⚡ Quick Start (30 seconds)

1. Install from VS Code Extensions (`Ctrl+Shift+X`)
2. Open your project folder
3. Press `Ctrl+Shift+E` (or `Cmd+Shift+E` on Mac)
4. Done! ✓

That's it. No git setup needed. No config dialogs. Just one shortcut.

## ✨ Three Simple Commands

### 1. **Quick Empty Commit** (`Ctrl+Shift+E`)
The fastest way to initialize. Creates a commit called "Empty commit" instantly.
- Auto-initializes git if needed
- No prompts, no delays
- Perfect for post-fork setup

### 2. **Custom Message** (`Ctrl+Alt+E`)
Same as Quick, but lets you name your commit.
- Type your message
- Creates the commit
- One-step workflow

### 3. **Initialize Repository** (`Ctrl+Shift+Alt+E`)
Full setup with optional git user configuration.
- Initializes git
- (Optional) Set your name/email
- Creates first commit with your message

## ⌨️ Keyboard Shortcuts

| Use Case | Shortcut (Windows/Linux) | Shortcut (Mac) |
|----------|--------------------------|----------------|
| Fastest initialization | `Ctrl+Shift+E` | `Cmd+Shift+E` |
| With custom message | `Ctrl+Alt+E` | `Cmd+Alt+E` |
| Full setup (with config) | `Ctrl+Shift+Alt+E` | `Cmd+Shift+Alt+E` |

*Note: Use shortcuts in Explorer view (File view) for fastest access*

Or use Command Palette (`Ctrl+Shift+P`):
- `Empty Commit: Quick Empty Commit`
- `Empty Commit: Create Empty Commit with Message`
- `Empty Commit: Initialize Repository`

## 💡 Common Workflows

### Post-Fork Initialization
```
1. Fork repo on GitHub
2. Clone it locally
3. Open folder in VS Code
4. Press Ctrl+Shift+E
5. Your repo is initialized! ✓
```

### CI/CD Pipeline Trigger
Create empty commit to run GitHub Actions or GitLab CI without code changes:
```
Ctrl+Alt+E → Type "chore: trigger CI/CD" → Enter
```

### Initialize Feature Branch
```
git checkout -b feature/new-feature
Ctrl+Shift+E  # Creates initial commit on new branch
```

## 🚀 Features

- **Auto-initializes git** - If folder isn't a git repo yet, we set it up
- **Zero config** - Works out of the box, no setup needed
- **Smart defaults** - Quick shortcut for fastest use
- **Optional customization** - Add git config when you want
- **Multi-folder support** - Works with monorepos and multi-root workspaces
- **Secure** - No shell injection vulnerabilities
- **Cross-platform** - Windows, Mac, Linux supported

## 📋 Requirements

- VS Code 1.75.0 or higher
- Git installed and in PATH
- An open folder in VS Code

## 🐛 Troubleshooting

### It didn't work / git not found

**Solution:** Make sure git is installed and in your PATH
- **Windows:** Install [Git for Windows](https://git-scm.com/download/win)
- **Mac:** `brew install git`
- **Linux:** `sudo apt-get install git`

Then restart VS Code.

### Shortcut doesn't work

**Solutions:**
1. Click on Explorer/File view first (Explorer must be focused)
2. Try reloading VS Code (`Ctrl+Shift+P` → "Reload Window")
3. Check Extensions view - make sure extension is enabled

### Command Palette shows no commands

Reload VS Code: `Ctrl+Shift+P` → "Reload Window"

## 👨‍💻 Development

### Build
```bash
npm run compile
```

### Watch (auto-rebuild)
```bash
npm run watch
```

### Lint
```bash
npm run lint          # Check for issues
npm run lint:fix      # Auto-fix issues
```

### Test
Press `F5` in VS Code to launch Extension Development Host

## 📦 How It Works

This extension wraps these git commands:

```bash
# Quick commit:
git init                          # If needed
git commit --allow-empty -m "Empty commit"

# With git config:
git init                          # If needed
git config user.name "Your Name"
git config user.email "email@example.com"
git commit --allow-empty -m "Your message"
```

All done safely with proper error handling and input validation.

## 📄 License

MIT License - Use freely!

## 🤝 Contributing

Found an issue or have an idea? Open an issue on [GitHub](https://github.com/Ed-bb/vscode-empty-commit-extension)

## 🔐 Security

- Uses safe argument passing (no shell injection vulnerabilities)
- Validates all user input
- Sanitizes error messages

---

**The simplest way to initialize a repo after forking.** 🚀
