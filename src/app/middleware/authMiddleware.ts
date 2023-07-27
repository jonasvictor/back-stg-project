import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { ForbiddenError, UnauthorizedError } from "../helpers/api-erros";

// Middleware para verificar a autenticação do usuário
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    // Verifica se o token foi enviado
    if (!authorization) {
        throw new UnauthorizedError('Não autorizado');
    }

    const token = authorization.split(' ')[1];

    // Verifica a validade do token e autentica o usuário
    try {
        jwt.verify(token, process.env.JWT_PASS ?? '');
    } catch {
        throw new ForbiddenError('Token inválido');
    }

    next();
}
