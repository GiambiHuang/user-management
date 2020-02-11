const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use('/api/user', require('./routes/user'));
// app.use('/api/profile', require('./routes/profile'));

app.listen(PORT, () => {
  console.log('SERVER UP');
});
