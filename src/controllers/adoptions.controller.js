import { adoptionsService, petsService, usersService } from "../services/index.js";
import { CustomErrors } from "../utils/CustomErrors.js";
import { TIPOS_ERROR } from "../utils/EErros.js";

const getAllAdoptions = async (req, res, next) => {
    try {
        const result = await adoptionsService.getAll();
        res.send({ status: "success", payload: result });
    } catch (error) {
        next(error);
    }
};

const getAdoption = async (req, res, next) => {
    try {
        const adoptionId = req.params.aid;
        const adoption = await adoptionsService.getBy({ _id: adoptionId });

        if (!adoption) {
            return next(CustomErrors.createError(
                "Adoption Not Found",
                `Adoption with ID ${adoptionId} not found`,
                "Adoption lookup failed",
                TIPOS_ERROR.NOT_FOUND
            ));
        }

        res.send({ status: "success", payload: adoption });
    } catch (error) {
        next(error);
    }
};

const createAdoption = async (req, res, next) => {
    try {
        const { uid, pid } = req.params;

        const user = await usersService.getUserById(uid);
        if (!user) {
            return next(CustomErrors.createError(
                "User Not Found",
                `User with ID ${uid} not found`,
                "User lookup failed",
                TIPOS_ERROR.NOT_FOUND
            ));
        }

        const pet = await petsService.getBy({ _id: pid });
        if (!pet) {
            return next(CustomErrors.createError(
                "Pet Not Found",
                `Pet with ID ${pid} not found`,
                "Pet lookup failed",
                TIPOS_ERROR.NOT_FOUND
            ));
        }

        if (pet.adopted) {
            return next(CustomErrors.createError(
                "Pet Already Adopted",
                `Pet with ID ${pid} is already adopted`,
                "Adoption conflict",
                TIPOS_ERROR.ARGUMENTOS_INVALIDOS
            ));
        }

        // Actualizar usuario y mascota
        user.pets.push(pet._id);
        await usersService.update(user._id, { pets: user.pets });
        await petsService.update(pet._id, { adopted: true, owner: user._id });

        // Registrar adopción
        const newAdoption = await adoptionsService.create({ owner: user._id, pet: pet._id });

        res.send({ status: "success", message: "Pet adopted successfully", payload: newAdoption });
    } catch (error) {
        next(error);
    }
};

export default {
    createAdoption,
    getAllAdoptions,
    getAdoption
};