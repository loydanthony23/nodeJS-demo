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

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn

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
│   │   └── products.js       # Product routes
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

