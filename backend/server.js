import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import competitionsRouter from './routes/competitions.js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Use the competitions router under /api/competitions
app.use('/api/competitions', competitionsRouter);

// Serve frontend static files from '../frontend' relative to backend folder
app.use(express.static(path.resolve(__dirname, '../frontend')));

// Root route: serve frontend index.html to avoid "Cannot GET /"
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
