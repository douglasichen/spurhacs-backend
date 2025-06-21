import express from 'express';
import cors from 'cors';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to read bugs data
async function readBugsData() {
  try {
    const data = await fs.readFile(path.join(__dirname, '../bugs.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading bugs data:', error);
    return { bugs: [] };
  }
}

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Get all bugs data
app.get('/api/bugs', async (req, res) => {
  try {
    const data = await readBugsData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bugs data' });
  }
});

// Export the Express app for Vercel
export default app;
