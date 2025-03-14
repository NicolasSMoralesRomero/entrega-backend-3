import { usersService } from "../services/index.js";
import { CustomErrors } from "../utils/CustomErrors.js";
import { TIPOS_ERROR } from "../utils/EErros.js";

const getAllUsers = async (req, res, next) => {
    try {
        const users = await usersService.getAll();
        res.send({ status: "success", payload: users });
    } catch (error) {
        next(error);
    }
};

const getUser = async (req, res, next) => {
    try {
        const userId = req.params.uid;
        const user = await usersService.getUserById(userId);

        if (!user) {
            throw CustomErrors.createError(
                "Error Get User",
                `User with ID ${userId} not found`,
                "User lookup failed",
                TIPOS_ERROR.NOT_FOUND
            );
        }

        res.send({ status: "success", payload: user });
    } catch (error) {
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const updateBody = req.body;
        const userId = req.params.uid;
        const user = await usersService.getUserById(userId);

        if (!user) {
            throw CustomErrors.createError(
                "User not found",
                `User with ID ${userId} not found`,
                "User update failed",
                TIPOS_ERROR.NOT_FOUND
            );
        }

        const updatedUser = await usersService.update(userId, updateBody);

        res.send({ status: "success", payload: updatedUser });
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.uid;
        const user = await usersService.getUserById(userId);

        if (!user) {
            throw CustomErrors.createError(
                "User Not Found",
                `User with ID ${userId} not found`,
                "User delete failed",
                TIPOS_ERROR.NOT_FOUND
            );
        }

        await usersService.delete(userId);
        res.send({ status: "success", message: "User deleted" });
    } catch (error) {
        next(error);
    }
};

export default {
    deleteUser,
    getAllUsers,
    getUser,
    updateUser
};