// build.js
import { execSync } from 'child_process';
import { existsSync, mkdirSync, cpSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to execute commands and log output
function runCommand(command, directory) {
  try {
    console.log(`Running "${command}" in ${directory}`);
    execSync(command, {
      cwd: directory,
      stdio: 'inherit'
    });
  } catch (error) {
    console.error(`Error executing ${command} in ${directory}:`, error);
    process.exit(1);
  }
}

// Create dist directory if it doesn't exist
if (!existsSync('dist')) {
  mkdirSync('dist');
}

// Build each portal
const portals = ['admin-frontend', 'employee-frontend', 'student-frontend'];

portals.forEach(portal => {
  const portalPath = join(__dirname, portal);
  
  // Install dependencies
  runCommand('npm install', portalPath);
  
  // Build the portal
  runCommand('npm run build', portalPath);
  
  // Copy the build output to dist
  const buildPath = join(portalPath, 'dist');
  const targetPath = join(__dirname, 'dist', portal);
  
  if (existsSync(buildPath)) {
    if (!existsSync(targetPath)) {
      mkdirSync(targetPath, { recursive: true });
    }
    cpSync(buildPath, targetPath, { recursive: true });
  }
});

// Copy root index.html to dist
copyFileSync(
  join(__dirname, 'index.html'),
  join(__dirname, 'dist', 'index.html')
);