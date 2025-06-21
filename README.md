# SpurHacks Backend Server

A Node.js Express backend server for managing bug data and analysis.

## Features

- RESTful API for bug management
- CRUD operations (Create, Read, Update, Delete)
- Search functionality
- JSON file-based data storage
- Security middleware (Helmet, CORS)
- Request logging with Morgan
- Development hot-reload with Nodemon

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Development Mode
Start the server with hot-reload:
```bash
npm run dev
```

### Production Mode
Start the server:
```bash
npm start
```

The server will run on `http://localhost:3000` by default.

## API Endpoints

### Health Check
- **GET** `/health` - Check server status

### Bugs API
- **GET** `/api/bugs` - Get all bugs
- **GET** `/api/bugs/:id` - Get a specific bug by ID
- **POST** `/api/bugs` - Create a new bug
- **PUT** `/api/bugs/:id` - Update a bug
- **DELETE** `/api/bugs/:id` - Delete a bug
- **GET** `/api/bugs/search/:query` - Search bugs by name

### Example API Usage

#### Get all bugs
```bash
curl http://localhost:3000/api/bugs
```

#### Get a specific bug
```bash
curl http://localhost:3000/api/bugs/1
```

#### Create a new bug
```bash
curl -X POST http://localhost:3000/api/bugs \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Memory Leak",
    "bad": ["[10:00:00] Memory usage: 500MB", "[10:01:00] Memory usage: 1GB"],
    "good": ["[10:00:00] Memory usage: 500MB", "[10:01:00] Memory usage: 510MB"],
    "analysis": "Memory leak caused by unclosed event listeners"
  }'
```

#### Update a bug
```bash
curl -X PUT http://localhost:3000/api/bugs/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Race Condition",
    "analysis": "Updated analysis of the race condition"
  }'
```

#### Delete a bug
```bash
curl -X DELETE http://localhost:3000/api/bugs/1
```

#### Search bugs
```bash
curl http://localhost:3000/api/bugs/search/race
```

## Data Structure

Each bug object has the following structure:
```json
{
  "id": 1,
  "name": "Bug Name",
  "bad": ["array", "of", "bad", "log", "entries"],
  "good": ["array", "of", "good", "log", "entries"],
  "analysis": "Analysis of the bug and solution"
}
```

## Environment Variables

Create a `.env` file in the root directory:
```
PORT=3000
NODE_ENV=development
```

## Dependencies

- **express** - Web framework
- **cors** - Cross-origin resource sharing
- **helmet** - Security middleware
- **morgan** - HTTP request logger
- **dotenv** - Environment variable loader

## Development Dependencies

- **nodemon** - Development server with hot-reload

## Project Structure

```
spurhacks/
├── server.js          # Main server file
├── bugs.json          # Bug data storage
├── package.json       # Project configuration
├── .env              # Environment variables
├── .gitignore        # Git ignore rules
└── README.md         # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes
5. Submit a pull request

## License

ISC
