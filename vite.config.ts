import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import type { Plugin } from 'vite'

// Custom plugin to add API routes
function apiRoutes(): Plugin {
  return {
    name: 'api-routes',
    configureServer(server) {
      // Serve match data through API endpoint
      server.middlewares.use('/api/matches', (req, res) => {
        try {
          const matchResults = [];
          // Read all match result files
          for (let i = 1; i <= 22; i++) {
            const paddedNumber = i < 10 ? `0${i}` : `${i}`;
            const filePath = path.resolve(
              process.cwd(), 
              `data/results/match_results_${paddedNumber}.json`
            );
            
            if (fs.existsSync(filePath)) {
              const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
              matchResults.push(data);
            }
          }
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(matchResults));
        } catch (error) {
          console.error('Error serving match data:', error);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'Failed to load match data' }));
        }
      });
      
      // Serve individual match result files
      server.middlewares.use('/data/results', (req, res, next) => {
        // Extract the requested file name from URL
        const matchFile = req.url?.split('/').pop();
        
        if (matchFile && matchFile.startsWith('match_results_') && matchFile.endsWith('.json')) {
          try {
            const filePath = path.resolve(process.cwd(), `data/results/${matchFile}`);
            
            if (fs.existsSync(filePath)) {
              const data = fs.readFileSync(filePath, 'utf-8');
              res.setHeader('Content-Type', 'application/json');
              res.end(data);
              return;
            }
          } catch (error) {
            console.error(`Error serving match result file ${matchFile}:`, error);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: `Failed to load match result file: ${matchFile}` }));
            return;
          }
        }
        
        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    apiRoutes()
  ],
  // Configure public directories
  publicDir: 'public',
  // Ensure data directory is properly served
  server: {
    fs: {
      // Allow serving files from one level up (where data directory is)
      allow: ['..']
    }
  }
})
