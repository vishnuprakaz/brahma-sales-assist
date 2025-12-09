#!/bin/bash

# Simple Git hooks setup for coding agents

echo "Setting up Git hooks..."

# Copy hooks from scripts/hooks to .git/hooks
cp scripts/hooks/* .git/hooks/
chmod +x .git/hooks/*

echo "✅ Git hooks installed"
echo "Hooks will remind agents to update tasks.json, features.json, and context files"
