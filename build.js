import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('[BUILD] Building ORAYVE Frontend...');
execSync('npm --prefix orayve-frontend install', { stdio: 'inherit' });
execSync('npm --prefix orayve-frontend run build', { stdio: 'inherit' });

const srcDist = path.resolve('orayve-frontend', 'dist');

// 1. Mirror to root 'dist' (for Netlify standard publish directory)
const rootDist = path.resolve('dist');
fs.rmSync(rootDist, { recursive: true, force: true });
fs.cpSync(srcDist, rootDist, { recursive: true });
console.log('[BUILD] Successfully mirrored to root /dist');

// 2. Mirror to 'Deployed live/Live' (for Netlify manual folder deploy)
const liveDist = path.resolve('Deployed live', 'Live');
fs.rmSync(liveDist, { recursive: true, force: true });
fs.cpSync(srcDist, liveDist, { recursive: true });
console.log('[BUILD] Successfully mirrored to /Deployed live/Live');

// 3. Ensure backend dependencies are installed
if (fs.existsSync('orayve-backend/package.json')) {
  console.log('[BUILD] Installing backend dependencies...');
  execSync('npm --prefix orayve-backend install', { stdio: 'inherit' });
}

console.log('[BUILD] All production artifacts built and verified!');
