import { faker } from '@faker-js/faker';
import { createHash } from '../utils/index.js';


// A mejorar: 
// que el mail generado sea igual al nombre y apellido

export const generateMockUsers = async (count = 10) => {
    return Promise.all(Array.from({ length: count }, async () => {
        const password = "password123"; // Contraseña predefinida
        const hashedPassword = await createHash(password);

        return {
            _id: faker.database.mongodbObjectId(),
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: hashedPassword,
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
        adopted: faker.datatype.boolean(),
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