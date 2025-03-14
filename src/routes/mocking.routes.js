import { Router } from 'express';
import { generateMockUsers, generateMockPets, generateMockAdoptions } from '../services/mockingService.js';

import { passwordValidation } from '../utils/index.js';
import { CONFIG } from '../config/config.js';
import jwt from 'jsonwebtoken';
import { CustomErrors } from '../utils/CustomErrors.js';
import { TIPOS_ERROR } from '../utils/EErros.js';

import userModel from "../dao/models/User.js"
import petModel from "../dao/models/Pet.js"

const router = Router();

let mockUsers = [];

router.get('/users', (req, res) => {
    const mockUsers = generateMockUsers(10);
    res.send({ status: "success", payload: mockUsers });
});

router.get('/pets', (req, res) => {
    const mockPets = generateMockPets(10);
    res.send({ status: "success", payload: mockPets });
});

router.get('/adoptions', (req, res) => {
    const mockAdoptions = generateMockAdoptions(10);
    res.send({ status: "success", payload: mockAdoptions });
});


router.get('/generate-users', async (req, res, next) => {
    try {
        mockUsers = await generateMockUsers(5);
        res.send({ status: "success", payload: mockUsers });
    } catch (error) {
        next(error); // Enviamos el error al errorHandler
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(CustomErrors.createError(
                "Mock Login Error",
                "Incomplete values",
                "Missing email or password",
                TIPOS_ERROR.ARGUMENTOS_INVALIDOS
            ));
        }

        const user = mockUsers.find(user => user.email === email);

        if (!user) {
            return next(CustomErrors.createError(
                "Mock Login Error",
                `User with email ${email} not found`,
                "User not found",
                TIPOS_ERROR.NOT_FOUND
            ));
        }

        const isValidPassword = await passwordValidation(user, password);

        if (!isValidPassword) {
            return next(CustomErrors.createError(
                "Mock Login Error",
                "Incorrect password",
                "Invalid credentials",
                TIPOS_ERROR.AUTENTICACION
            ));
        }

        const token = jwt.sign({ id: user._id, email: user.email }, CONFIG.JWT_SECRET, { expiresIn: "1h" });

        res.cookie('mockToken', token, { maxAge: 3600000, httpOnly: true })
           .send({ status: "success", message: "Mock login successful" });

    } catch (error) {
        next(error);
    }
});

router.get('/mockingusers', async (req, res, next) => {
    try {
        const mockUsers = await generateMockUsers(50);
        res.json({ status: "success", payload: mockUsers });
    } catch (error) {
        req.logger.error(`Error en /mockingusers: ${error.message}`);
        next(error);
    }
});


router.get('/mockingpets', (req, res) => {
    const mockPets = generateMockPets(10);
    res.json({ status: "success", payload: mockPets });
});

// Endpoint para generar usuarios y mascotas en la base de datos
router.post('/generateData', async (req, res, next) => {
    try {
        const { users, pets } = req.body;

        if (!users || !pets) {
            return res.status(400).json({ error: "Debe proporcionar la cantidad de usuarios y mascotas a generar" });
        }

        const mockUsers = await generateMockUsers(users);
        await userModel.insertMany(mockUsers);

        const mockPets = generateMockPets(pets);
        await petModel.insertMany(mockPets);

        res.json({ status: "success", message: "Datos insertados correctamente" });
    } catch (error) {
        req.logger.error(`Error en /generateData: ${error.message}`);
        next(error);
    }
});

export default router;