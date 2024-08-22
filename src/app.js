require('dotenv').config();


const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const express = require('express');
const routes = require("./routes/index");
const rateLimiterMiddleWare = require('./middleware/rateLimit');

const server = express();

server.use(morgan('combined'));

// Middleware to handle rate limiting
server.use(rateLimiterMiddleWare);

// Security-related headers middleware
server.use(helmet());

// Enable CORS
server.use(cors());

// Body parsing middleware
server.use(express.json());
server.use(express.urlencoded({ extended: true }));



// Health check route
server.get('/check', (req, res) => {
    res.send('Hello World!');
});

// Main routes
server.use('/v1', routes);

// Start the server and listen on the provided port or fallback to 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server')
    server.close(() => {
        console.log('HTTP server closed')
    })
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server')
    server.close(() => {
        console.log('HTTP server closed')
    })
});
