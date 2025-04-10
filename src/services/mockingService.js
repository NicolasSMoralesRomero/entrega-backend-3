import { faker } from '@faker-js/faker';
import { createHash } from '../utils/index.js';

export const generateMockUsers = async (count = 10) => {
    return Promise.all(Array.from({ length: count }, async () => {
        const password = "coder123"; // Contraseña predefinida
        const hashedPassword = await createHash(password);

        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@gmail.com`;

        return {
            _id: faker.database.mongodbObjectId(),
            first_name: firstName,
            last_name: lastName,
            email: email.replace(/ /g, ""), // Elimina espacios si los hubiera
            password: hashedPassword,
            role: faker.helpers.arrayElement(["user", "admin"]), // Asigna rol aleatorio
            pets: [],
        };
    }));
};

export const generateMockPets = (count = 10) => {
    return Array.from({ length: count }, () => ({
        _id: faker.database.mongodbObjectId(),
        name: faker.animal.dog(),
        specie: faker.helpers.arrayElement(["dog", "cat", "rabbit"]),
        birthDate: faker.date.past().toISOString(),
        adopted: false,
    }));
};

export const generateMockAdoptions = (count = 10) => {
    return Array.from({ length: count }, () => ({
        _id: faker.database.mongodbObjectId(),
        owner: faker.database.mongodbObjectId(),
        pet: faker.database.mongodbObjectId(),
        adoptionDate: faker.date.past().toISOString(),
    }));
};