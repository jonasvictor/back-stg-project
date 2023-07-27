import Usuario from "../entities/Usuario";
import IUsuario from "../interface/IUsuario";
import { AppDataSource } from "../../database/data-source";
import Transacao from "../entities/Transacao";
import { BadRequestError, InternalServerError } from "../helpers/api-erros";
import { getSaldoUsuario } from "./TransacaoRepository";
import ITransacao from "../interface/ITransacao";

const usuarioRepository = AppDataSource.getRepository(Usuario);
const transacaoRepository = AppDataSource.getRepository(Transacao);

// Função para obter todos os usuários do db
const getUsuarios = (): Promise<IUsuario[]> => {
  return usuarioRepository.find({
    order: { id: 'ASC' },
    select: ['id', 'name', 'email'],
  });
};

// Função para criar um novo usuário no db
const createUsuario = async (usuario: IUsuario): Promise<IUsuario> => {

  // Verifica se o e-mail já está cadastrado
  const usuarioExistente = await usuarioRepository.findOne({ where: { email: usuario.email } });
  if (usuarioExistente) {
    throw new InternalServerError('E-mail já cadastrado. Por favor, use outro e-mail.');
  }

  // Cria uma nova instância de Usuário com os dados recebidos
  const novoUsuario: Usuario = usuarioRepository.create(usuario);

  // Salva a nova instância de Usuário no db
  return usuarioRepository.save(novoUsuario);
};

// Função para obter um usuário pelo seu ID e suas transações relacionadas
const getUsuarioId = async (id: number): Promise<IUsuario | undefined> => {
  // Busca o usuário pelo ID no db
  const usuario: Usuario | undefined | null = await usuarioRepository.findOne({ where: { id }, relations: ['transacoes'] });

  if (usuario !== null) {
    // Retorna o usuário encontrado
    return {
      id: usuario.id,
      name: usuario.name,
      email: usuario.email,
      transacoes: usuario.transacoes,
    };
  }
  return undefined;
};

// Função para atualizar um usuário no db
const updateUsuario = async (id: number, usuario: IUsuario): Promise<IUsuario | undefined> => {
  // Busca o usuário pelo ID no db
  const usuarioExistente: Usuario | null = await usuarioRepository.findOne({ where: { id } });

  if (!usuarioExistente) {
    return undefined;
  }

  // Atualiza os campos do usuário com os novos dados
  usuarioExistente.name = usuario.name;
  usuarioExistente.email = usuario.email;

  // Salva as alterações no db
  await usuarioRepository.save(usuarioExistente);

  // Cria um novo objeto excluindo a propriedade de senha
  const usuarioAtualizado: IUsuario = {
    id: usuarioExistente.id,
    name: usuarioExistente.name,
    email: usuarioExistente.email,
  };

  // Retorna o usuário atualizado -> (IUsuario)
  return usuarioAtualizado;
};

// Função para excluir um usuário do db
const deleteUsuario = async (id: number): Promise<IUsuario | null> => {

  // Buscar o usuário pelo ID no db
  const usuarioExistente: Usuario | null = await usuarioRepository.findOne({ where: { id } });

  // Verifica se o usuário foi encontrado
  if (!usuarioExistente) {
    return null;
  }

  // Verifica se o usuário possui transações com o status_id = 1 'pendente'
  const transacoesPendentes: ITransacao[] = await transacaoRepository.find({where: { usuario_id: id, status_id: 1}});
  if (transacoesPendentes.length > 0) {
    throw new BadRequestError('O usuário possui transações pendentes e não pode ser excluído.')
  }

  // Busca o saldo atual do usuário com base nas transações concluídas
  const saldoAtual: number = await getSaldoUsuario(id) || 0;

  // Verificar se o saldo é maior que zero
  if (saldoAtual > 0) {
    throw new BadRequestError('O usuário possui saldo em conta e não pode ser excluído.');
  }

  // Remover transações associadas ao usuário
  await transacaoRepository.delete({ usuario_id: id });

  // Remover usuário
  await usuarioRepository.delete(id);

  // Retorna o usuário excluído no formato de IUsuario
  return {
    id: usuarioExistente.id,
    name: usuarioExistente.name,
    email: usuarioExistente.email,
    senha: usuarioExistente.senha,
  };
};



export default { getUsuarios, createUsuario, updateUsuario, getUsuarioId, deleteUsuario };
