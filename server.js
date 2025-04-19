const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect(process.env.DB_CONNECTION)
  .then(() => console.log(" Connected to Database"))
  .catch((err) => console.error(" MongoDB connection error:", err));


const postRoutes = require('./routes/posts_routes');
app.use('/posts', postRoutes);


app.get('/', (req, res) => {
  res.send('Hello World!@@@@@@@@@');
});


module.exports = app; 