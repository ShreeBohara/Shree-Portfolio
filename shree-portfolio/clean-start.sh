#!/bin/bash

# Clean start script for Next.js dev server
# This script kills any running Next.js processes and removes lock files

echo "🧹 Cleaning up..."

# Kill processes on ports 3000 and 3001
lsof -ti:3000,3001 | xargs kill -9 2>/dev/null

# Kill any Next.js dev processes
pkill -f "next dev" 2>/dev/null

# Remove lock file
rm -f .next/dev/lock 2>/dev/null

# Wait a moment
sleep 1

echo "✅ Cleanup complete!"
echo "🚀 Starting dev server..."
npm run dev

