import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { CONFIG } from './config/config.js';
import { router } from './routes/indexRouter.js';
import { errorHandler } from './middleware/errorHandler.js'
import { logger, AddLogger } from './utils/logger.js';

const app = express();

// Mongoose
mongoose
  .connect(CONFIG.MONGO.URL)
  .then(() => logger.info("Conectado a la Base de datos"))
  .catch((err) => logger.error(`Error conectando a la base de datos: ${err.message}`))

app.use(express.json());
app.use(cookieParser());
// Middleware logger
app.use(AddLogger)

//Router
app.use('/', router);

// Middleware errorhandler
app.use(errorHandler)

app.listen(CONFIG.PORT, () => {
    logger.info(`Start server in PORT ${CONFIG.PORT}`);
});