// incrementVersion.mjs
import fs from 'fs/promises';
import path from 'path';

const packageJsonPath = path.join(process.cwd(), 'package.json');

// Read the package.json file
async function updateVersion() {
  try {
    const data = await fs.readFile(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(data);
    const currentVersion = packageJson.version.split('.').map(Number);

    // Increment the patch version (last number)
    currentVersion[2] += 1; // Increment the patch version
    packageJson.version = currentVersion.join('.');

    // Write the updated package.json back to the file
    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('Version updated to:', packageJson.version);
  } catch (err) {
    console.error('Error updating version:', err);
  }
}

updateVersion();