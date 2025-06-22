import express from 'express';
import cors from 'cors';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import { geminiDiagnosis } from '../gemini-utils.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to read bugs data from specific set
async function readBugsData(set) {
  try {
    const fileName = `${set}.json`;
    const data = await fs.readFile(path.join(__dirname, '../bugs_sets', fileName), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading bugs data for set ${set}:`, error);
    return { bugs: [] };
  }
}

// Helper function to read graph data from specific set
async function readGraphData(set) {
  try {
    const fileName = `${set}.json`;
    const data = await fs.readFile(path.join(__dirname, '../graphs_sets', fileName), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading graph data for set ${set}:`, error);
    return { graphs: [] };
  }
}

// Helper function to validate set parameter
function validateSet(set) {
  const validSets = ['0', '1', '2', '3'];
  return validSets.includes(set?.toString());
}

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Get bugs data by set
app.get('/api/bugs', async (req, res) => {
  try {
    const { set } = req.query;
    
    // Validate set parameter
    if (!set) {
      return res.status(400).json({ error: 'Set parameter is required (0, 1, 2, or 3)' });
    }
    
    if (!validateSet(set)) {
      return res.status(400).json({ error: 'Invalid set. Must be 0, 1, 2, or 3' });
    }
    
    const data = await readBugsData(set);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bugs data' });
  }
});

// Get diagnosis for a specific bug by ID and set
app.get('/api/diagnose-bug', async (req, res) => {
  try {
    const { id, set } = req.query;
    
    // Validate set parameter
    if (!set) {
      return res.status(400).json({ error: 'Set parameter is required (0, 1, 2, or 3)' });
    }
    
    if (!validateSet(set)) {
      return res.status(400).json({ error: 'Invalid set. Must be 0, 1, 2, or 3' });
    }
    
    // Validate ID parameter
    if (!id) {
      return res.status(400).json({ error: 'Bug ID parameter is required' });
    }
    
    const bugId = parseInt(id, 10);
    if (isNaN(bugId)) {
      return res.status(400).json({ error: 'Bug ID must be a valid number' });
    }
    
    // Read bugs data from specified set
    const data = await readBugsData(set);
    
    // Find the bug with the specified ID
    const bug = data.bugs.find(b => b.id === bugId);
    
    if (!bug) {
      return res.status(404).json({ error: `Bug with ID ${bugId} not found in set ${set}` });
    }
    
    // Return the diagnosis information for the specific bug
    const diagnosis = {
      diagnosis: bug?.diagnosis
    };

    try {
      diagnosis.diagnosis = await geminiDiagnosis(bug);
    } catch (error) {
      console.error('Error adding AI diagnosis:', error);
    }

    res.json(diagnosis);
  } catch (error) {
    console.error('Error fetching bug diagnosis:', error);
    res.status(500).json({ error: 'Failed to fetch bug diagnosis' });
  }
});

// Get graph data by ID and set
app.get('/api/graph', async (req, res) => {
  try {
    const { id, set } = req.query;
    
    // Validate set parameter
    if (!set) {
      return res.status(400).json({ error: 'Set parameter is required (0, 1, 2, or 3)' });
    }
    
    if (!validateSet(set)) {
      return res.status(400).json({ error: 'Invalid set. Must be 0, 1, 2, or 3' });
    }
    
    // Validate ID parameter
    if (!id) {
      return res.status(400).json({ error: 'ID parameter is required' });
    }

    const graphId = parseInt(id, 10);
    if (isNaN(graphId)) {
      return res.status(400).json({ error: 'ID must be a valid number' });
    }

    // Read graph data from specified set
    const data = await readGraphData(set);

    // Find the graph with the specified ID
    const graph = data.graphs.find(g => g.id === graphId);

    if (!graph) {
      return res.status(404).json({ error: `Graph with ID ${graphId} not found in set ${set}` });
    }
    
    res.json(graph);
  } catch (error) {
    console.error('Error fetching graph data:', error);
    res.status(500).json({ error: 'Failed to fetch graph data' });
  }
});

// Get all graphs data by set
app.get('/api/graphs', async (req, res) => {
  try {
    const { set } = req.query;
    
    // Validate set parameter
    if (!set) {
      return res.status(400).json({ error: 'Set parameter is required (0, 1, 2, or 3)' });
    }
    
    if (!validateSet(set)) {
      return res.status(400).json({ error: 'Invalid set. Must be 0, 1, 2, or 3' });
    }
    
    const data = await readGraphData(set);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch graphs data' });
  }
});

// Export the Express app for Vercel
export default app;
