import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Dynamic route loading
const routePath = path.join(__dirname, 'routes');
fs.readdirSync(routePath).forEach((file) => {
    if (file.endsWith('.js')) {
      import(`./routes/${file}`).then((routeModule) => {
        const routeName = file.replace('.js', '');
        app.use(`/api/${routeName}`, routeModule.default);
        console.log(`Route registered: /api/${routeName}`);
      });
    }
  });

// Test endpoint
app.get('/api/test', (req, res) => {
  res.status(200).json({ message: 'Test endpoint working!' });
});

export default app;