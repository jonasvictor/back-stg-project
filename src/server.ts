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

app.use(routers)

AppDataSource.initialize().then(async () => {
    // app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    //     console.log(error);
    //     return res.json('Caiu no middleware de erro.')
    // })
    app.use(errorMiddleware)
    console.log('Database connected');
    app.listen(process.env.PORT, () => {
        console.log(`Server started on port ${process.env.PORT}`);
    });
}).catch((error) => {
    console.log('Database connection failed');
    console.log(error);
});
