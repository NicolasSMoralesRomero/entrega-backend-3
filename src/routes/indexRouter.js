import { Router } from "express"

import usersRouter from './users.router.js'
import petsRouter from './pets.router.js'
import adoptionsRouter from './adoption.router.js'
import sessionsRouter from './sessions.router.js'
import mockingRoutes from './mocking.routes.js'

import { swaggerUi as swaggerUiUsers, userSpec } from '../docs/swaggerUsersConfig.js';
import { swaggerUi as swaggerUiPets, petSpec } from '../docs/swaggerPetsConfig.js';

export const router = Router()

router.use('/api/users', usersRouter);
router.use('/api/pets', petsRouter);
router.use('/api/adoptions', adoptionsRouter);
router.use('/api/sessions', sessionsRouter);
router.use('/api/mocks', mockingRoutes);
router.use('/api/docs/users', swaggerUiUsers.serve, swaggerUiUsers.setup(userSpec));
router.use('/api/docs/pets', swaggerUiPets.serve, swaggerUiPets.setup(petSpec));