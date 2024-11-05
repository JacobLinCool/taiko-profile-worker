import fs from 'node:fs';

const workerCode = fs.readFileSync('.svelte-kit/cloudflare/_worker.js', 'utf-8');
const newWorkerCode = workerCode.replace(/requireNode\(\);/, 'requireBrowser();');
fs.writeFileSync('.svelte-kit/cloudflare/_worker.js', newWorkerCode);
