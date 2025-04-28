import fs from 'fs';
import path from 'path';

const resultsDir = path.join(process.cwd(), 'public', 'data', 'results');
const manifestPath = path.join(resultsDir, 'match_manifest.json');

const files = fs.readdirSync(resultsDir);
const matchNumbers = files
  .map(file => {
    const match = file.match(/^match_results_(\d+)\.json$/);
    return match ? parseInt(match[1], 10) : null;
  })
  .filter(num => num !== null)
  .sort((a, b) => a - b);

fs.writeFileSync(manifestPath, JSON.stringify(matchNumbers, null, 2));

console.log(`Generated match_manifest.json with ${matchNumbers.length} matches.`); 