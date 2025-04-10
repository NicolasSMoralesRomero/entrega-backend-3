import dotenv from 'dotenv';

const envFile = process.env.NODE_ENV === 'test' ? '.env.testing' : '.env';
dotenv.config({ path: envFile });

export const CONFIG = {
    PORT: process.env.PORT || 5000,
    MONGO: {
        URL: process.env.MONGO_URL,
        SECRET: process.env.MONGO_SECRET
    },
    JWT_SECRET: process.env.JWT_SECRET,
    COOKIE_SECRET: process.env.COOKIE_SECRET
};