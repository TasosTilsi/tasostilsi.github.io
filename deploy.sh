#!/bin/bash

# filepath: /home/tasostilsi/Development/Projects/tasostilsi.github.io/deploy.sh

# Exit immediately if a command exits with a non-zero status
set -e

# Build the Next.js project
echo "Building the project..."
npm run build

# Ensure the out folder exists
if [ ! -d "out" ]; then
  echo "Error: 'out' folder not found. Make sure the build step completed successfully."
  exit 1
fi

# Switch to the gh-pages branch
echo "Switching to gh-pages branch..."
git checkout gh-pages || git checkout -b gh-pages

# Remove all files except the .git directory
echo "Cleaning up old files..."
shopt -s extglob
rm -rf !(".git")
shopt -u extglob

# Copy the contents of the out folder to the root
echo "Copying new files..."
cp -r out/* .

# Add and commit changes
echo "Committing changes..."
git add .
git commit -m "Deploy site to GitHub Pages"

# Push to the gh-pages branch
echo "Pushing to gh-pages branch..."
git push origin gh-pages --force

# Switch back to the master branch
echo "Switching back to master branch..."
git checkout master

# Clean up the out folder
echo "Cleaning up the out folder..."
rm -rf out

echo "Deployment complete!"
