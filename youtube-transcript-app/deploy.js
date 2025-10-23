#!/usr/bin/env node

/**
 * Deployment helper script
 * Run with: node deploy.js
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, description) {
  try {
    log(`\n${description}...`, 'blue');
    execSync(command, { stdio: 'inherit' });
    log(`✓ ${description} completed`, 'green');
  } catch (error) {
    log(`✗ ${description} failed`, 'red');
    process.exit(1);
  }
}

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    log(`✓ ${description} exists`, 'green');
  } else {
    log(`✗ ${description} missing`, 'red');
    return false;
  }
  return true;
}

async function main() {
  log('🚀 YouTube Transcript App Deployment Helper', 'blue');
  
  // Check if we're in the right directory
  if (!fs.existsSync('package.json')) {
    log('Error: Please run this script from the youtube-transcript-app directory', 'red');
    process.exit(1);
  }

  // Check required files
  log('\n📋 Checking deployment files...', 'yellow');
  const requiredFiles = [
    ['vercel.json', 'Vercel configuration'],
    ['render.yaml', 'Render configuration'],
    ['.env.production', 'Production environment variables'],
    ['Dockerfile', 'Docker configuration']
  ];

  let allFilesExist = true;
  for (const [file, desc] of requiredFiles) {
    if (!checkFile(file, desc)) {
      allFilesExist = false;
    }
  }

  if (!allFilesExist) {
    log('\nSome required files are missing. Please check the DEPLOYMENT.md guide.', 'red');
    process.exit(1);
  }

  // Build the project
  runCommand('npm run build', 'Building frontend');

  // Check if Vercel CLI is installed
  try {
    execSync('vercel --version', { stdio: 'ignore' });
    log('✓ Vercel CLI is installed', 'green');
    
    const deployToVercel = process.argv.includes('--vercel');
    if (deployToVercel) {
      runCommand('vercel --prod', 'Deploying to Vercel');
    } else {
      log('\nTo deploy to Vercel, run: node deploy.js --vercel', 'yellow');
    }
  } catch (error) {
    log('⚠ Vercel CLI not installed. Install with: npm i -g vercel', 'yellow');
  }

  log('\n📝 Next steps:', 'blue');
  log('1. Deploy backend to Render using the render.yaml file', 'reset');
  log('2. Update vercel.json with your actual Render backend URL', 'reset');
  log('3. Update .env.production with your actual backend URL', 'reset');
  log('4. Deploy frontend to Vercel', 'reset');
  log('5. Update Google OAuth settings with production URLs', 'reset');
  log('\nSee DEPLOYMENT.md for detailed instructions.', 'yellow');
}

main().catch(console.error);