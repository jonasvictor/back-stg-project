import "dotenv/config"
import "reflect-metadata"
import { DataSource } from "typeorm"
import Usuario from "../app/entities/Usuario"

// const port = process.env.DB_PORT as number | undefined

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT as number | undefined,
    // port: Number(process.env.POSTGRES_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    // synchronize: false,
    // logging: true,
    // entities: [`${__dirname}/**/entities/*.{ts,js}`],
    entities: [Usuario],
    // migrations: [],
    // subscribers: [],
})
