import { buildDate, version } from 'virtual:build-info';

console.log('Build date:', buildDate);
console.log('Version:', version);

export { buildDate, version };

// import packageJson from '../package.json' assert { type: "json" };

// export const version: string = packageJson.version;

// Format: "YYYY Mon DD" (e.g., "2025 Feb 04")

// export const buildDate: string = __BUILD_DATE__;

  // console.log('Build Date from env:', buildDate);
// export const buildDate: string = new Date().toISOString(); // Current build date

export default {
  version,
  buildDate
};