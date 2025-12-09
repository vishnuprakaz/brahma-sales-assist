# Scripts

## Setup Git Hooks

Install Git hooks for coding agents:

```bash
./scripts/setup-git-hooks.sh
```

This installs a simple pre-commit checklist reminder.

## Hooks

Git hooks are stored in `scripts/hooks/` and copied to `.git/hooks/` during setup.

- **pre-commit** - Shows checklist reminder before commits
- **post-commit** - Shows success message after commits

