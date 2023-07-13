import { Request, Response } from "express";
import Usuario from "../entities/Usuario";
import { AppDataSource } from "../../database/data-source";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

class AuthController {
  async authenticate(req: Request, res: Response) {
    const repository = AppDataSource.getRepository(Usuario);
    const { email, senha } = req.body;

    const usuario = await repository.findOne({ where: { email } });

    if (!usuario) {
      return res.sendStatus(401);
    }

    const isValidPassword = await bcrypt.compare(senha, usuario.senha);

    if (!isValidPassword) {
      return res.sendStatus(401);
    }

    const token = jwt.sign({ id: usuario.id }, 'secret', { expiresIn: '1d' });

    return res.json({
      usuario,
      token
    });
  };
};

export default new AuthController();
