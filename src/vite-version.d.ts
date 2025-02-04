   // src/version.d.ts
declare module '../version.js' {
    const version: string; // Adjust the type if necessary
    export default version;
  }

import { version } from '../package.json'; // Adjust the path as necessary
export default version;