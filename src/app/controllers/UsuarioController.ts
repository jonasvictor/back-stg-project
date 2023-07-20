import { Request, Response, Router } from 'express';
import UsuarioRepository from '../repositories/UsuarioRepository';
import IUsuario from '../interface/IUsuario';
import { InternalServerError, NotFoundError } from '../helpers/api-erros';

const usuarioRouter = Router();

// usuarioRouter.get('/', async (_req: Request, res: Response): Promise<Response> => {
//   try {
//     const usuarios: IUsuario[] = await UsuarioRepository.getUsuarios();

//     // Remove a propriedade 'senha' de cada usuário
//     const removeSenhas = usuarios.map(usuario => {
//       const removeSenha = Object.assign({}, usuario);
//       delete removeSenha.senha;
//       return removeSenha;
//     });

//     return res.status(200).json(removeSenhas);
//   } catch (error) {
//     return res.status(500).json({ error: 'Erro ao buscar usuários' });
//   }
// });

usuarioRouter.get('/', async (_req: Request, res: Response): Promise<Response> => {

    const buscaUsuarios: IUsuario[] = await UsuarioRepository.getUsuarios();
    // Remove a propriedade 'senha' de cada usuário
    const removeSenhas = buscaUsuarios.map(usuario => {
      const removeSenha = Object.assign({}, usuario);
      delete removeSenha.senha;
      return removeSenha;
    });

    if (!buscaUsuarios) {
      throw new InternalServerError('Houve um problema ao buscar os usuários no banco de dados.');
    }
    
    return res.status(200).json(removeSenhas);
});

// usuarioRouter.post('/', async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const { name, email, senha }: IUsuario = req.body;
//     const usuario: IUsuario = { name, email, senha };
//     const usuarioCriado: IUsuario = await UsuarioRepository.createUsuario(usuario);
//     return res.status(201).json(usuarioCriado);
//   } catch (error) {
//     return res.status(500).json({ error: 'Erro ao criar usuário' });
//   }
// });

usuarioRouter.post('/', async (req: Request, res: Response): Promise<Response> => {

    const { name, email, senha }: IUsuario = req.body;
    const usuario: IUsuario = { name, email, senha };
    const usuarioCriado: IUsuario = await UsuarioRepository.createUsuario(usuario);

    if (!usuarioCriado) {
      throw new InternalServerError('Houve um problema ao criar o usuário no banco de dados.');
    }

    return res.status(201).json(usuarioCriado);
  });

// usuarioRouter.get('/:id', async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const id: number = parseInt(req.params.id);
//     const usuario: IUsuario | undefined = await UsuarioRepository.getUsuarioId(id);
//     if (usuario) {
//       return res.status(200).json(usuario);
//     } else {
//       return res.status(404).json({ error: 'Usuário não encontrado' });
//     }
//   } catch (error) {
//     return res.status(500).json({ error: 'Erro ao buscar usuário' });
//   }
// });

usuarioRouter.get('/:id', async (req: Request, res: Response): Promise<Response> => {

    const id: number = parseInt(req.params.id);
    const usuario: IUsuario | undefined = await UsuarioRepository.getUsuarioId(id);

    if (!usuario) {
      throw new NotFoundError('O ID fornecido não corresponde a nenhum usuário registrado. Verifique o ID e tente novamente.');
    }

    return res.status(200).json(usuario);
});

// usuarioRouter.put('/:id', async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const { id } = req.params;
//     const { name, email }: IUsuario = req.body;
//     const usuario: IUsuario = { name, email };
//     const usuarioAtualizado: IUsuario | undefined = await UsuarioRepository.updateUsuario(Number(id), usuario);
    
//     if (!usuarioAtualizado) {
//       return res.status(404).json({ error: 'Usuário não encontrado' });
//     }
    
//     return res.status(200).json(usuarioAtualizado);
//   } catch (error) {
//     return res.status(500).json({ error: 'Erro ao atualizar usuário' });
//   }
// });

usuarioRouter.put('/:id', async (req: Request, res: Response): Promise<Response> => {

    const { id } = req.params;
    const { name, email }: IUsuario = req.body;
    const usuario: IUsuario = { name, email };
    const usuarioAtualizado: IUsuario | undefined = await UsuarioRepository.updateUsuario(Number(id), usuario);
    
    if (!usuarioAtualizado) {
      throw new NotFoundError('O ID fornecido não corresponde a nenhum usuário registrado. Verifique o ID e tente novamente.');
    }
    
    return res.status(200).json(usuarioAtualizado);
});

// usuarioRouter.delete('/:id', async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const { id } = req.params;
//     const usuarioExcluido: IUsuario | null = await UsuarioRepository.deleteUsuario(Number(id));

//     if (usuarioExcluido === null) {
//       return res.status(404).json({ error: 'Usuário não encontrado' });
//     }

//     return res.status(200).json({ message: 'Usuário excluído com sucesso' });
//   } catch (error) {
//     return res.status(500).json({ error: 'Erro ao excluir usuário' });
//   }
// });

usuarioRouter.delete('/:id', async (req: Request, res: Response): Promise<Response> => {

    const { id } = req.params;
    const usuarioExcluido: IUsuario | null = await UsuarioRepository.deleteUsuario(Number(id));

    if (usuarioExcluido === null) {
      throw new NotFoundError('O ID fornecido não corresponde a nenhum usuário registrado. Verifique o ID e tente novamente.');
    }

    return res.status(200).json({ message: 'Usuário excluído com sucesso' });
});

export default usuarioRouter;
