import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { CONFIG } from './config/config.js';
import { router } from './routes/indexRouter.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Mongoose
mongoose
  .connect(CONFIG.MONGO.URL)
  .then(() => console.log("Conectado a la Base de datos"))
  .catch((err) => console.error(err));

app.use(express.json());
app.use(cookieParser());

//Router
app.use('/', router);

// Middleware errorhandler
app.use(errorHandler)

app.listen(CONFIG.PORT, () => {
    console.log(`Start server in PORT ${CONFIG.PORT}`);
});