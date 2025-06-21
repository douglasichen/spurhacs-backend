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

// Helper function to read graph data
async function readGraphData() {
  try {
    const data = await fs.readFile(path.join(__dirname, '../graph_data.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading graph data:', error);
    return { graphs: [] };
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

// Get graph data by ID
app.get('/api/graph', async (req, res) => {
  try {
    const { id } = req.query;
    
    // Validate ID parameter
    if (!id) {
      return res.status(400).json({ error: 'ID parameter is required' });
    }
    
    const graphId = parseInt(id, 10);
    if (isNaN(graphId)) {
      return res.status(400).json({ error: 'ID must be a valid number' });
    }
    
    // Read graph data
    const data = await readGraphData();
    
    // Find the graph with the specified ID
    const graph = data.graphs.find(g => g.id === graphId);
    
    if (!graph) {
      return res.status(404).json({ error: `Graph with ID ${graphId} not found` });
    }
    
    res.json(graph);
  } catch (error) {
    console.error('Error fetching graph data:', error);
    res.status(500).json({ error: 'Failed to fetch graph data' });
  }
});

// Get all graphs data
app.get('/api/graphs', async (req, res) => {
  try {
    const data = await readGraphData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch graphs data' });
  }
});

// Export the Express app for Vercel
export default app;
