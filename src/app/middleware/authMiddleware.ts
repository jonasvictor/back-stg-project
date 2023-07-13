import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

interface TokenPayload {
    id: number;
    iat: number;
    exp: number;
}

export default function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.sendStatus(401);
    }

    const token = authorization.replace('Bearer', '').trim();

    try {
        const data = jwt.verify(token, 'secret');
        const { id } = data as TokenPayload;
        req.usuarioId = id;
        console.log(data);
        return next();
    } catch {
        return res.sendStatus(401);
    }
//   const authHeader = req.headers.authorization;

//   if (!authHeader) {
//     return res.sendStatus(401);
//   }

//   const [, token] = authHeader.split(' ');

//   try {
//     const payload = jwt.verify(token, 'secret');
//     console.log(payload);
//     return next();
//   } catch (error) {
//     return res.sendStatus(401);
//   }
}