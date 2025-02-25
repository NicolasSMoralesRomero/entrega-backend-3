import PetDTO from "../dto/Pet.dto.js";
import { petsService } from "../services/index.js"
import __dirname from "../utils/index.js";

import { CustomErrors } from "../utils/CustomErrors.js";
import { TIPOS_ERROR } from "../utils/EErros.js";

const getAllPets = async (req, res, next) => {
    try {
        const pets = await petsService.getAll();
        res.send({ status: "success", payload: pets });
    } catch (error) {
        next(error);
    }
};

const createPet = async (req, res, next) => {
    try {
        const { name, specie, birthDate } = req.body;
        if (!name || !specie || !birthDate) {
            return CustomErrors.createError(
                "Error Creating Pet",
                "Missing required fields",
                "Incomplete values",
                TIPOS_ERROR.ARGUMENTOS_INVALIDOS
            );
        }

        const pet = PetDTO.getPetInputFrom({ name, specie, birthDate });
        const result = await petsService.create(pet);

        res.send({ status: "success", payload: result });
    } catch (error) {
        next(error);
    }
};

const updatePet = async (req, res, next) => {
    try {
        const petUpdateBody = req.body;
        const petId = req.params.pid;

        const existingPet = await petsService.getById(petId);
        if (!existingPet) {
            return CustomErrors.createError(
                "Error Updating Pet",
                `Pet with ID ${petId} not found`,
                "Pet doesn't exist",
                TIPOS_ERROR.NOT_FOUND
            );
        }

        await petsService.update(petId, petUpdateBody);
        res.send({ status: "success", message: "Pet updated" });
    } catch (error) {
        next(error);
    }
};

const deletePet = async (req, res, next) => {
    try {
        const petId = req.params.pid;

        const existingPet = await petsService.getById(petId);
        if (!existingPet) {
            return CustomErrors.createError(
                "Error Deleting Pet",
                `Pet with ID ${petId} not found`,
                "Pet doesn't exist",
                TIPOS_ERROR.NOT_FOUND
            );
        }

        await petsService.delete(petId);
        res.send({ status: "success", message: "Pet deleted" });
    } catch (error) {
        next(error);
    }
};

const createPetWithImage = async (req, res, next) => {
    try {
        const file = req.file;
        const { name, specie, birthDate } = req.body;

        if (!name || !specie || !birthDate || !file) {
            return CustomErrors.createError(
                "Error Creating Pet with Image",
                "Missing required fields or image",
                "Incomplete values",
                TIPOS_ERROR.ARGUMENTOS_INVALIDOS
            );
        }

        const pet = PetDTO.getPetInputFrom({
            name,
            specie,
            birthDate,
            image: `${__dirname}/../public/img/${file.filename}`
        });

        const result = await petsService.create(pet);
        res.send({ status: "success", payload: result });
    } catch (error) {
        next(error);
    }
};

export default {
    getAllPets,
    createPet,
    updatePet,
    deletePet,
    createPetWithImage
};