import 'reflect-metadata';
import 'express-async-errors';
import cors from 'cors';
import { AppDataSource } from './database/data-source';
import routers from './app/routes/routes';
import express from 'express';
import { errorMiddleware } from './app/middleware/errorMiddleware';

const app = express();

app.use(cors());

app.use(express.json());

app.use(routers);

// Inicializa a conexão com o banco de dados através do TypeORM
AppDataSource.initialize().then(async () => {

    app.use(errorMiddleware);

    console.log('Database connected');

    app.listen(process.env.PORT, () => {
        console.log(`Server started on port ${process.env.PORT}`);
    });

}).catch((error) => {
    console.log('Database connection failed');
    console.log(error);
});
