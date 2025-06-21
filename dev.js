import app from './api/index.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

// Start server for local development
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🐛 Bugs API: http://localhost:${PORT}/api/bugs`);
  console.log(`📈 All Graphs API: http://localhost:${PORT}/api/graphs`);
  console.log(`📊 Graph by ID API: http://localhost:${PORT}/api/graph?id=1`);
});
