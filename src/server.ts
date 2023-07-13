import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { AppDataSource } from './database/data-source';
import routers from './app/routes/routes';

const app = express();

app.use(cors());

app.use(express.json());

app.use(routers)

AppDataSource.initialize().then(async () => {
    console.log('Database connected');
    app.listen(process.env.PORT, () => {
        console.log(`Server started on port ${process.env.PORT}`);
    });
}).catch((error) => {
    console.log('Database connection failed');
    console.log(error);
});
