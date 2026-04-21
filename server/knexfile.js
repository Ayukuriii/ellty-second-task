"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
// loads .env.local if it exists, falls back to .env
require('dotenv').config({
    path: path_1.default.resolve(__dirname, '..', '.env.local'),
    override: false, // won't override vars already in process.env
});
require('dotenv').config({
    path: path_1.default.resolve(__dirname, '..', '.env'),
});
const config = {
    development: {
        client: 'pg',
        connection: {
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT ?? 5432),
            database: process.env.POSTGRES_DB,
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
        },
        migrations: {
            directory: './src/models/migrations',
            extension: 'ts',
            loadExtensions: ['.ts'],
        },
    },
    production: {
        client: 'pg',
        connection: {
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT ?? 5432),
            database: process.env.POSTGRES_DB,
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
        },
        migrations: {
            directory: './dist/models/migrations',
            extension: 'js',
            loadExtensions: ['.js'],
        },
        pool: { min: 2, max: 10 },
    },
};
exports.default = config;
//# sourceMappingURL=knexfile.js.map