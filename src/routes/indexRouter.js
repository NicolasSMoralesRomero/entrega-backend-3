import { Router } from "express";

import usersRouter from './users.router.js';
import petsRouter from './pets.router.js';
import adoptionsRouter from './adoption.router.js';
import sessionsRouter from './sessions.router.js';


export const router = Router()

router.use('/api/users', usersRouter);
router.use('/api/pets', petsRouter);
router.use('/api/adoptions', adoptionsRouter);
router.use('/api/sessions', sessionsRouter);