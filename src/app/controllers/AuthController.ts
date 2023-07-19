import { Request, Response } from "express";
import Usuario from "../entities/Usuario";
import { AppDataSource } from "../../database/data-source";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from "../helpers/api-erros";
import { getSession, getToken, removeSession, setSession } from "../../redis/sessionManager";

// type JwtPayload = {
//   id: number;
// }

class AuthController {
  async login(req: Request, res: Response) {
    const repository = AppDataSource.getRepository(Usuario);
    const { email, senha } = req.body;

    const usuario = await repository.findOne({ where: { email } });

    if (!usuario) {
      throw new UnauthorizedError('Acesso não autorizado.');
    }

    const isValidSenha = await bcrypt.compare(senha, usuario.senha);

    if (!isValidSenha) {
      throw new UnauthorizedError('Acesso não autorizado.');
      // throw new BadRequestError('Email ou senha inválidos.');
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
    
  };

  async logout(req: Request, res: Response) {
    const token = req.headers.authorization?.split(' ')[1];
    
    // if (!token) {
    //   throw new ForbiddenError('Não autorizado');
    // }

    // Remover sessão associada ao token
    console.log('Logout realizado com sucesso')
    return res.json( await removeSession(token));
  }
};

export default new AuthController();

// const usuario = await AppDataSource.getRepository(Usuario).findOne({ where: { id } });

// if (!usuario) {
//   throw new UnauthorizedError('Não autorizado');
// }

// const { senha: senhaUsuario, ...usuarioLogadoSemSenha } = usuario;

// req.usuario = usuarioLogadoSemSenha;

// return res.json({});