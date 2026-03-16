#!/bin/bash

echo "🔧 Fixing npm vulnerabilities..."

# Fix npm audit issues
npm audit fix

# If still have issues, try force fix (careful!)
echo "⚠️  If you want to force fix (may break things):"
echo "npm audit fix --force"

echo "✅ NPM audit fix completed!"