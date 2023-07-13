import { Request, Response, NextFunction } from "express";
import { ApiError } from "../helpers/api-erros";

export const errorMiddleware = (error: Error & Partial<ApiError>, req: Request, res: Response, next: NextFunction) => {
    const statusCode = error.statusCode ?? 500;
    const message = error.message ?? 'Internal server error';
    return res.status(statusCode).json({ message });
}
