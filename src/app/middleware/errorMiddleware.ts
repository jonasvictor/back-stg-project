import { Request, Response, NextFunction } from "express";
import { ApiError } from "../helpers/api-erros";

// Middleware para tratar erros
export const errorMiddleware = (error: Error & Partial<ApiError>, req: Request, res: Response, next: NextFunction) => {

    // Verifica se o erro é conhecido
    const statusCode = error.statusCode ?? 500;
    const message = error.message ?? 'Internal server error';
    return res.status(statusCode).json({ message });
}
