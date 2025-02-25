import { usersService } from "../services/index.js";
import { createHash, passwordValidation } from "../utils/index.js";
import jwt from 'jsonwebtoken';
import UserDTO from '../dto/User.dto.js';
import { CONFIG } from "../config/config.js";

import { CustomErrors } from "../utils/CustomErrors.js";
import { TIPOS_ERROR } from "../utils/EErros.js";

const register = async (req, res, next) => {
    try {
        const { first_name, last_name, email, password } = req.body;

        if (!first_name || !last_name || !email || !password) {
            return CustomErrors.createError(
                "Error Register User",
                "Missing required fields",
                "Incomplete values",
                TIPOS_ERROR.ARGUMENTOS_INVALIDOS
            );
        }

        const exists = await usersService.getUserByEmail(email);
        if (exists) {
            return CustomErrors.createError(
                "Error Register User",
                `User with email ${email} already exists`,
                "User already exists",
                TIPOS_ERROR.ARGUMENTOS_INVALIDOS
            );
        }

        const hashedPassword = await createHash(password);
        const user = { first_name, last_name, email, password: hashedPassword };
        let result = await usersService.create(user);

        console.log(result);
        res.send({ status: "success", payload: result._id });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return CustomErrors.createError(
                "Error Login User",
                "Missing email or password",
                "Incomplete values",
                TIPOS_ERROR.ARGUMENTOS_INVALIDOS
            );
        }

        const user = await usersService.getUserByEmail(email);
        if (!user) {
            return CustomErrors.createError(
                "User Not Found",
                `User with email ${email} not found`,
                "User doesn't exist",
                TIPOS_ERROR.NOT_FOUND
            );
        }

        const isValidPassword = await passwordValidation(user, password);
        if (!isValidPassword) {
            return CustomErrors.createError(
                "Error Login",
                "Incorrect password",
                "Invalid credentials",
                TIPOS_ERROR.AUTENTICACION
            );
        }

        const userDto = UserDTO.getUserTokenFrom(user);
        const token = jwt.sign(userDto, CONFIG.JWT_SECRET, { expiresIn: "1h" });

        res.cookie(CONFIG.COOKIE_NAME, token, { maxAge: 3600000, httpOnly: true }).send({
            status: "success",
            message: "Logged in"
        });
    } catch (error) {
        next(error);
    }
};

const current = async (req, res, next) => {
    try {
        const cookie = req.cookies[CONFIG.COOKIE_NAME];
        if (!cookie) {
            return CustomErrors.createError(
                "Authentication Error",
                "No token found",
                "Missing authentication",
                TIPOS_ERROR.AUTENTICACION
            );
        }

        const user = jwt.verify(cookie, CONFIG.JWT_SECRET);
        return res.send({ status: "success", payload: user });
    } catch (error) {
        next(CustomErrors.createError(
            "Invalid Token",
            "Failed to verify token",
            "Authentication error",
            TIPOS_ERROR.AUTENTICACION
        ));
    }
};

const unprotectedLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return CustomErrors.createError(
                "Error Login User",
                "Missing email or password",
                "Incomplete values",
                TIPOS_ERROR.ARGUMENTOS_INVALIDOS
            );
        }

        const user = await usersService.getUserByEmail(email);
        if (!user) {
            return CustomErrors.createError(
                "User Not Found",
                `User with email ${email} not found`,
                "User doesn't exist",
                TIPOS_ERROR.NOT_FOUND
            );
        }

        const isValidPassword = await passwordValidation(user, password);
        if (!isValidPassword) {
            return CustomErrors.createError(
                "Error Login",
                "Incorrect password",
                "Invalid credentials",
                TIPOS_ERROR.AUTENTICACION
            );
        }

        const token = jwt.sign(user, CONFIG.JWT_SECRET, { expiresIn: "1h" });

        res.cookie("unprotectedCookie", token, { maxAge: 3600000, httpOnly: true }).send({
            status: "success",
            message: "Unprotected Logged in"
        });
    } catch (error) {
        next(error);
    }
};

const unprotectedCurrent = async (req, res, next) => {
    try {
        const cookie = req.cookies["unprotectedCookie"];
        if (!cookie) {
            return CustomErrors.createError(
                "Authentication Error",
                "No token found",
                "Missing authentication",
                TIPOS_ERROR.AUTENTICACION
            );
        }

        const user = jwt.verify(cookie, CONFIG.JWT_SECRET);
        return res.send({ status: "success", payload: user });
    } catch (error) {
        next(CustomErrors.createError(
            "Invalid Token",
            "Failed to verify token",
            "Authentication error",
            TIPOS_ERROR.AUTENTICACION
        ));
    }
};

export default {
    register,
    login,
    current,
    unprotectedLogin,
    unprotectedCurrent
};