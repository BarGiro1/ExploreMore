import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import express,{Express} from 'express';
import postsRoutes from './routes/posts_routes';
import commentsRoutes from './routes/comments_routes';
import usersRoutes from './routes/users_routes';
import likesRoutes from './routes/likes_routes';
import authRoutes from './routes/auth_routes';


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
console.log('here');
app.use('/auth', authRoutes);

app.use('/posts', postsRoutes);
app.use('/comments', commentsRoutes);
app.use('/users', usersRoutes);
app.use('/likes', likesRoutes);

const initApp = () => {
  return new Promise<Express>((resolve, reject) => {
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", () => console.log("Connected to the database"));

    mongoose
      .connect(process.env.MONGO_URL as string)
      .then(() => {
        resolve(app);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export = initApp;
