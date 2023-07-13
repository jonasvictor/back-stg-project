import "dotenv/config"
import "reflect-metadata"
import { DataSource } from "typeorm"
import Usuario from "../app/entities/Usuario"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT as number | undefined,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    logging: true,
    entities: [Usuario],
    // synchronize: false,
    // migrations: [],
    // subscribers: [],
})
