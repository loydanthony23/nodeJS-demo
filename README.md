# Node Deploy Demo

A Node.js Express API demonstration project showcasing RESTful API endpoints, error handling, and best practices for deployment.

## 🚀 Features

- **Express.js** server with modern ES6+ modules
- **CORS** enabled for cross-origin requests
- **Environment-based configuration** using dotenv
- **RESTful API** endpoints for demo purposes
- **Error handling** middleware
- **Health check** endpoint
- **User management** demo endpoints
- **Product management** demo endpoints
- **Task management** RESTful API (complete CRUD with filtering and sorting)

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Checking if Node.js is Installed

Before proceeding, check if Node.js is already installed on your system:

**On Windows (Command Prompt or PowerShell):**
```bash
node --version
npm --version
```

If both commands return version numbers, Node.js and npm are already installed. If you get an error like `'node' is not recognized as an internal or external command`, you need to install Node.js.

### Installing Node.js on Windows

If Node.js is not found on your Windows PC, follow these steps:

1. **Download Node.js:**
   - Visit the official Node.js website: [https://nodejs.org/](https://nodejs.org/)
   - Download the **LTS (Long Term Support)** version for Windows (recommended)
   - The installer file will be named something like `node-vXX.X.X-x64.msi`

2. **Run the Installer:**
   - Double-click the downloaded `.msi` file
   - Follow the installation wizard:
     - Click "Next" on the welcome screen
     - Accept the license agreement
     - Choose the installation directory (default is recommended)
     - **Important:** Make sure "Add to PATH" option is checked (it should be by default)
     - Click "Install" and wait for the installation to complete

3. **Verify Installation:**
   - Close and reopen your Command Prompt or PowerShell window
   - Run the following commands to verify:
   ```bash
   node --version
   npm --version
   ```
   - Both commands should now display version numbers (e.g., `v18.17.0` and `9.6.7`)

4. **Troubleshooting:**
   - If the commands still don't work after installation, restart your computer
   - Ensure Node.js was added to your system PATH during installation
   - You can manually add Node.js to PATH if needed:
     - Go to System Properties → Environment Variables
     - Add `C:\Program Files\nodejs\` to your PATH variable

**Note:** npm (Node Package Manager) is automatically included with Node.js, so you don't need to install it separately.

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd node-deploy-demo
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
NODE_ENV=development
PORT=3000
APP_NAME=Node Deploy Demo
```

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```
Starts the server with nodemon for automatic reloading on file changes.

### Production Mode
```bash
npm start
```
Starts the server in production mode.

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## 📚 API Endpoints

### Health Check
- **GET** `/api/` - Returns app status and environment information

### Users
- **GET** `/api/users` - Get all users
- **GET** `/api/users/:id` - Get user by ID
- **POST** `/api/users` - Create a new user
- **PUT** `/api/users/:id` - Update a user
- **DELETE** `/api/users/:id` - Delete a user

### Products
- **GET** `/api/products` - Get all products
- **GET** `/api/products/:id` - Get product by ID
- **POST** `/api/products` - Create a new product
- **PUT** `/api/products/:id` - Update a product
- **DELETE** `/api/products/:id` - Delete a product

### Tasks (Sample RESTful API)
- **GET** `/api/tasks` - Get all tasks (supports filtering by status/priority and sorting)
- **GET** `/api/tasks/:id` - Get task by ID
- **POST** `/api/tasks` - Create a new task
- **PUT** `/api/tasks/:id` - Full update of a task
- **PATCH** `/api/tasks/:id` - Partial update of a task
- **DELETE** `/api/tasks/:id` - Delete a task

**Query Parameters for GET /api/tasks:**
- `status` - Filter by status (pending, in-progress, completed)
- `priority` - Filter by priority (low, medium, high)
- `sortBy` - Sort field (title, priority, dueDate, createdAt)
- `order` - Sort order (asc, desc)

**Example:** `GET /api/tasks?status=pending&priority=high&sortBy=dueDate&order=asc`

## 📁 Project Structure

```
node-deploy-demo/
├── src/
│   ├── app.js                 # Express app configuration
│   ├── server.js              # HTTP server setup
│   ├── config/
│   │   └── index.js          # Environment configuration
│   ├── routes/
│   │   ├── index.js          # Main routes
│   │   ├── users.js          # User routes
│   │   ├── products.js       # Product routes
│   │   └── tasks.js          # Task routes (sample RESTful API)
│   └── middleware/
│       └── errorHandler.js   # Error handling middleware
├── .env.example              # Environment variables template
├── .gitignore               # Git ignore rules
├── package.json             # Project dependencies
└── README.md               # Project documentation
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode (development/production) | `development` |
| `PORT` | Server port number | `3000` |
| `APP_NAME` | Application name | `Node Deploy Demo` |

## 🌐 Example API Requests

### Get App Status
```bash
curl http://localhost:3000/api/
```

### Create a User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'
```

### Get All Products
```bash
curl http://localhost:3000/api/products
```

### Tasks API Examples

#### Get all tasks
```bash
curl http://localhost:3000/api/tasks
```

#### Get tasks with filtering and sorting
```bash
curl "http://localhost:3000/api/tasks?status=pending&priority=high&sortBy=dueDate&order=asc"
```

#### Create a new task
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Learn RESTful APIs",
    "description": "Complete RESTful API tutorial",
    "status": "in-progress",
    "priority": "high",
    "dueDate": "2024-12-31"
  }'
```

#### Update a task (full update with PUT)
```bash
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated task title",
    "description": "Updated description",
    "status": "completed",
    "priority": "low",
    "dueDate": "2024-12-25"
  }'
```

#### Partially update a task (PATCH)
```bash
curl -X PATCH http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed"
  }'
```

#### Delete a task
```bash
curl -X DELETE http://localhost:3000/api/tasks/1
```

## 🚢 Deployment

This project is ready for deployment on various platforms:

- **Heroku**: Set environment variables in the Heroku dashboard
- **Railway**: Add environment variables in project settings
- **Render**: Configure environment variables in the service settings
- **AWS/DigitalOcean**: Use PM2 or systemd for process management

## 📝 License

ISC

## 👨‍💻 Development

This is a demo project for learning and demonstration purposes. Feel free to fork and modify as needed.

