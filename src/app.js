require('dotenv').config();

const express = require('express');
const cors = require('cors');

const server = express();
const helmet = require('helmet');
const routes = require("./routes/index");
const rateLimiterMiddleWare = require('./middleware/rateLimit');

// server.use(rateLimiterMiddleWare);

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use(helmet());
server.use(cors());

server.use('/auth', routes);

server.listen(process.env.PORT);
