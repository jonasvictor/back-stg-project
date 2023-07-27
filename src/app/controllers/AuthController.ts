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
  // Login do usuário
  async login(req: Request, res: Response) {

    const repository = AppDataSource.getRepository(Usuario);
    const { email, senha } = req.body;

    // Busca o usuário pelo email informado
    const usuario = await repository.findOne({ where: { email } });
    if (!usuario) {
      throw new UnauthorizedError('Acesso não autorizado.');
    }

    // Verifica se a senha é válida
    const isValidSenha = await bcrypt.compare(senha, usuario.senha);
    if (!isValidSenha) {
      throw new UnauthorizedError('Acesso não autorizado.');
    }

    // Gera um token para o usuário
    const token = jwt.sign({ id: usuario.id }, process.env.JWT_PASS ?? '', { expiresIn: '1h' });
    
    // Remove a senha do usuário
    const { senha: senhaUsuario, ...usuarioLoginSemSenha } = usuario;

    // Armazena o token e informações do usuário na sessão
    await setSession(token, usuarioLoginSemSenha);

    return res.json({
      usuario: usuarioLoginSemSenha,
      token
    });
  };

  async getPerfil(req: Request, res: Response) {
    // Pega o token do header
    const token = getToken(req.headers)

    // Busca as informações do usuário na sessão com base no token
    return res.json(await getSession(token));
  };

  async logout(req: Request, res: Response) {

    const token = req.headers.authorization?.split(' ')[1];

    // Remove a sessão associada ao token
    console.log('Logout realizado com sucesso')
    return res.json(await removeSession(token));
  }
};

export default new AuthController();
