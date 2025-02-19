import packageJson from '../package.json' assert { type: "json" };

export const version: string = packageJson.version;

// Format: "YYYY Mon DD" (e.g., "2025 Feb 04")

  export const buildDate: string = import.meta.env.BUILD_DATE || new Date().toLocaleDateString("en-US", {

    year: "numeric",
    month: "short",
    day: "2-digit",
  });

  console.log('Build Date from env:', import.meta.env.BUILD_DATE);
// export const buildDate: string = new Date().toISOString(); // Current build date

export default {
  version,
  buildDate
};