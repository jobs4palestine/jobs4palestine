#!/bin/bash

# Remove top-level node_modules and yarn cache
echo "Cleaning top-level node_modules and yarn cache..."
rm -rf node_modules
yarn cache clean

# Find and remove nested node_modules and yarn caches
echo "Cleaning nested node_modules and yarn caches..."
find . -name "node_modules" -type d -prune -exec rm -rf '{}' +
find . -name ".tsbuildinfo" -type f -delete

# Clear Vite cache
echo "Cleaning Vite cache..."
find . -name ".vite" -type d -prune -exec rm -rf '{}' +

# Clear ts-node cache
echo "Cleaning ts-node cache..."
rm -rf ~/.ts-node

# Reinstall dependencies for all packages
echo "Reinstalling dependencies..."
yarn install

# Rebuild all packages
echo "Rebuilding all packages..."
yarn workspaces run build

echo "Cleanup and reinstallation complete!"
