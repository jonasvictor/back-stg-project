import { Request, Response } from "express";
import Usuario from "../entities/Usuario";
import { AppDataSource } from "../../database/data-source";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { BadRequestError, UnauthorizedError } from "../helpers/api-erros";
import { getSession, getToken, setSession } from "../../redis/sessionManager";

// type JwtPayload = {
//   id: number;
// }

class AuthController {
  async login(req: Request, res: Response) {
    const repository = AppDataSource.getRepository(Usuario);
    const { email, senha } = req.body;

    const usuario = await repository.findOne({ where: { email } });

    if (!usuario) {
      throw new BadRequestError('Email ou senha inválidos.');
    }

    const isValidSenha = await bcrypt.compare(senha, usuario.senha);

    if (!isValidSenha) {
      throw new BadRequestError('Email ou senha inválidos.');
    }

    const token = jwt.sign({ id: usuario.id }, process.env.JWT_PASS ?? '', { expiresIn: '12h' });
    
    const { senha: senhaUsuario, ...usuarioLoginSemSenha } = usuario;

    await setSession(token, usuarioLoginSemSenha);

    return res.json({
      usuario: usuarioLoginSemSenha,
      token
    });
  };

  async getPerfil(req: Request, res: Response) {

    console.log(req.headers);

    const token = getToken(req.headers)

    return res.json( await getSession(token));
    

    // const usuario = await AppDataSource.getRepository(Usuario).findOne({ where: { id } });

    // if (!usuario) {
    //   throw new UnauthorizedError('Não autorizado');
    // }
    
    // const { senha: senhaUsuario, ...usuarioLogadoSemSenha } = usuario;

    // req.usuario = usuarioLogadoSemSenha;

    // return res.json({});
    
  };
};

export default new AuthController();
