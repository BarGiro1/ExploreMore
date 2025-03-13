const express = require('express');
const dotenv= require('dotenv').config();
const app = express();
const port =process.env.PORT;

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



 const postsRoutes = require('./routes/posts_routes');
 app.use('/posts', postsRoutes); 

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
    
});