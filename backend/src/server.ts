import swaggerUi from 'swagger-ui-express';
import swaggerDocument from 'swagger-jsdoc';
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
import fileRoutes from './routes/files_routes';


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

app.use('/auth', authRoutes);
app.use('/posts', postsRoutes);
app.use('/comments', commentsRoutes);
app.use('/users', usersRoutes);
app.use('/likes', likesRoutes);
app.use('/files', fileRoutes);
app.use('/public', express.static('public'));


if (process.env.NODE_ENV === 'development') {
  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Blog API',
        version: '1.0.0',
        description: 'A simple Express Library API',
      },
      servers: [
        {
          url: 'http://localhost:3000',
        },
      ],
    },
    apis: ['./src/routes/*.ts'],
  };
  const specs = swaggerDocument(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}
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
