#!/bin/bash

# Flowmodoro Version Management Script
# This script helps manage multiple versions of the flowmodoro timer

set -e

VERSIONS_DIR="versions"
NEXTJS_VERSION_DIR="$VERSIONS_DIR/nextjs-flowmodoro"

echo "🔄 Flowmodoro Version Management"
echo "================================"

show_help() {
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  run-main           Start main Vite version"
    echo "  run-nextjs         Start Next.js version"
    echo "  build-all          Build all versions"
    echo "  compare-versions   Show differences between versions"
    echo "  install-all        Install dependencies for all versions"
    echo "  help               Show this help message"
}

run_main() {
    echo "🚀 Starting main Vite version..."
    npm run dev
}

run_nextjs() {
    echo "🚀 Starting Next.js version..."
    if [ -d "$NEXTJS_VERSION_DIR" ]; then
        cd "$NEXTJS_VERSION_DIR"
        npm install
        npm run dev
    else
        echo "❌ Next.js version directory not found at $NEXTJS_VERSION_DIR"
        exit 1
    fi
}

build_all() {
    echo "🏗️ Building all versions..."
    
    echo "Building main Vite version..."
    npm run build
    
    if [ -d "$NEXTJS_VERSION_DIR" ]; then
        echo "Building Next.js version..."
        cd "$NEXTJS_VERSION_DIR"
        npm install
        npm run build
        cd ../..
        echo "✅ All versions built successfully"
    else
        echo "⚠️  Next.js version not found, only built main version"
    fi
}

compare_versions() {
    echo "🔍 Comparing versions..."
    echo ""
    echo "Main Vite version structure:"
    find src -name "*.tsx" -o -name "*.ts" | head -10
    echo ""
    if [ -d "$NEXTJS_VERSION_DIR" ]; then
        echo "Next.js version structure:"
        find "$NEXTJS_VERSION_DIR/src" -name "*.tsx" -o -name "*.ts" | head -10
    else
        echo "Next.js version not found"
    fi
}

install_all() {
    echo "📦 Installing dependencies for all versions..."
    
    echo "Installing main version dependencies..."
    npm install
    
    if [ -d "$NEXTJS_VERSION_DIR" ]; then
        echo "Installing Next.js version dependencies..."
        cd "$NEXTJS_VERSION_DIR"
        npm install
        cd ../..
        echo "✅ All dependencies installed"
    else
        echo "⚠️  Next.js version not found, only installed main version"
    fi
}

# Main command handling
case "${1:-help}" in
    "run-main")
        run_main
        ;;
    "run-nextjs")
        run_nextjs
        ;;
    "build-all")
        build_all
        ;;
    "compare-versions")
        compare_versions
        ;;
    "install-all")
        install_all
        ;;
    "help"|*)
        show_help
        ;;
esac 