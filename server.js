const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const express = require('express');
const app = express();
const postsRoutes = require('./routes/posts_routes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/posts', postsRoutes);

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

const initApp = () => {
  return new Promise(async(resolve, reject) => {
    await mongoose
      .connect(process.env.MONGO_URL)
      .then(() => {
        resolve(app);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

module.exports = initApp;
