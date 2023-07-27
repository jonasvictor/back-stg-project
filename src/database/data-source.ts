import "dotenv/config"
import "reflect-metadata"
import { DataSource } from "typeorm"
import Usuario from "../app/entities/Usuario"
import Transacao from "../app/entities/Transacao"
import { StatusTransacao } from "../app/entities/StatusTransacao"
import { TipoTransacao } from "../app/entities/TipoTransacao"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT as number | undefined,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    logging: true,
    entities: [Usuario, Transacao, StatusTransacao, TipoTransacao],
    // synchronize: false,
    // migrations: [],
    // subscribers: [],
})
