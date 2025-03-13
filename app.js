const express = require('express');
const dotenv= require('dotenv').config();
const app = express();
const port =process.env.PORT;


 const postsRoutes = require('./routes/posts_routes');
 app.use('/posts', postsRoutes); 

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
    
});