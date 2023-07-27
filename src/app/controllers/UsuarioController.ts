import { Request, Response, Router } from 'express';
import UsuarioRepository from '../repositories/UsuarioRepository';
import IUsuario from '../interface/IUsuario';
import { BadRequestError, InternalServerError, NotFoundError } from '../helpers/api-erros';
import { AppDataSource } from '../../database/data-source';
import Usuario from '../entities/Usuario';

const usuarioRouter = Router();

// Rota para listar todos os usuários
usuarioRouter.get('/', async (_req: Request, res: Response): Promise<Response> => {
  const usuarioRepository = AppDataSource.getRepository(Usuario);

  try {
    // Busca todos os usuários junto com suas transações associadas
    const usuarios = await usuarioRepository.createQueryBuilder("usuario")
      .leftJoinAndSelect("usuario.transacoes", "transacao")
      .select(["usuario.id", "usuario.name", "usuario.email"])
      .addSelect(["transacao.id", "transacao.usuario_id", "transacao.tipo_id", "transacao.status_id", "transacao.valor", "transacao.data"])
      .orderBy("usuario.id", "ASC")
      .getMany();

    // Retorna a lista de usuários
    return res.status(200).json(usuarios);

  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar os usuários no banco de dados." });
  }
});

// Rota para criar um novo usuário
usuarioRouter.post('/', async (req: Request, res: Response): Promise<Response> => {
  const { name, email, senha }: IUsuario = req.body;

  // Verifica se os campos obrigatórios foram preenchidos
  if (!name || !email || !senha) {
    throw new BadRequestError('Todos os campos devem ser preenchidos.');
  }

  // Cria um novo usuário chamando a função do repository
  const usuarioCriado: IUsuario = await UsuarioRepository.createUsuario({ name, email, senha });

  if (!usuarioCriado) {
    throw new InternalServerError('Houve um problema ao criar o usuário no banco de dados.');
  }

  // Retorna o usuário criado
  return res.status(201).json(usuarioCriado);
});

// Rota para obter um usuário pelo seu ID
usuarioRouter.get('/:id', async (req: Request, res: Response): Promise<Response> => {
  const id: number = parseInt(req.params.id);
  const usuario: IUsuario | undefined = await UsuarioRepository.getUsuarioId(id);

  if (!usuario) {
    throw new NotFoundError('O ID fornecido não corresponde a nenhum usuário registrado. Verifique o ID e tente novamente.');
  }

  // Retorna o usuário
  return res.status(200).json(usuario);
});

// Rota para atualizar um usuário pelo seu ID
usuarioRouter.put('/:id', async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { name, email }: IUsuario = req.body;
  const usuario: IUsuario = { name, email };

  // Atualiza o usuário chamando a função do repository
  const usuarioAtualizado: IUsuario | undefined = await UsuarioRepository.updateUsuario(Number(id), usuario);

  if (!usuarioAtualizado) {
    throw new NotFoundError('O ID fornecido não corresponde a nenhum usuário registrado. Verifique o ID e tente novamente.');
  }

  // Retornar o usuário atualizado
  return res.status(200).json(usuarioAtualizado);
});

// Rota para excluir um usuário pelo seu ID
usuarioRouter.delete('/:id', async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  // Excluir o usuário chamando a função do repository
  const usuarioExcluido: IUsuario | null = await UsuarioRepository.deleteUsuario(Number(id));

  if (usuarioExcluido === null) {
    throw new NotFoundError('O ID fornecido não corresponde a nenhum usuário registrado. Verifique o ID e tente novamente.');
  }

  // Retorna uma mensagem de sucesso
  return res.status(200).json({ message: 'Usuário excluído com sucesso' });
});

export default usuarioRouter;
