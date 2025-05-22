const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

// Load env vars
dotenv.config();

// Route files
// const auth = require('./routes/api/auth');
const wallet = require('./routes/wallet');  
// const transaction = require('./routes/api/transaction');

const app = express();

// Body parser
app.use(express.json());

// Set security headers
app.use(helmet());

// Enable CORS
app.use(cors());

// Mount routers
// app.use('/api/auth', auth);
app.use('/api/wallet', wallet);
// app.use('/api/transaction', transaction);


module.exports = app;