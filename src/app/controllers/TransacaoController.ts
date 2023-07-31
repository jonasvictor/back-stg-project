import { Request, Response } from 'express';
import ITransacao from '../interface/ITransacao';
import { BadRequestError, NotFoundError } from '../helpers/api-erros';
import { createDeposito, createSaque, createTransacao, deleteTransacao, getExtratoDepositoUsuario, getExtratoSaqueUsuario, getExtratoTransacoesUsuario, getSaldoUsuario, getTransacaoById, updateTransacaoStatus } from '../repositories/TransacaoRepository';
import { getUsuarioId } from '../repositories/UsuarioRepository';
// Cria uma transação
const createTransacaoController = async (req: Request, res: Response): Promise<Response> => {
    const { tipo_id, status_id, valor, data, usuario_id }: ITransacao = req.body;

    // Criar a transação chamando a função do repository
    const transacaoCriada: ITransacao = await createTransacao({ tipo_id, status_id, valor, data, usuario_id });

    if (!transacaoCriada) {
      throw new BadRequestError('Erro ao criar a transação.');
    }

    // Retorna a transação
    return res.status(201).json(transacaoCriada);
};

// Atualiza o status de uma transação
const updateTransacaoStatusController = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const { status_id } = req.body;

    // Atualizar o status da transação chamando a função do repository
    const transacaoAtualizada = await updateTransacaoStatus(Number(id), status_id);

    if (!transacaoAtualizada) {
      throw new NotFoundError('Erro ao atualizar o status da transação. A transação não foi encontrada.');
    }

    // Retorna a transação atualizada
    return res.status(200).json(transacaoAtualizada);
};

// Busca uma transação pelo seu ID
const getTransacaoByIdController = async (req: Request, res: Response): Promise<Response> => {
    // Extrai o ID da transação
    const { id } = req.params;

    // Busca a transação pelo ID chamando a função do repository
    const transacao = await getTransacaoById(Number(id));

    // Verifica se a transação foi encontrada
    if (!transacao) {
      throw new NotFoundError('A transação não foi encontrada.');
    }

    // Retorna a transação
    return res.status(200).json(transacao);
};

// Exclui uma transação pelo seu ID
const deleteTransacaoController = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    // Exclui a transação chamando a função do repository
    const transacaoExcluida = await deleteTransacao(Number(id));

    // Verifica se a transação foi encontrada
    if (!transacaoExcluida) {
      throw new NotFoundError('A transação não foi encontrada.');
    }

    return res.status(200).json({ message: 'Transação excluída com sucesso.' });
};

// Usados no front

// Cria uma transação do tipo depósito
const createDepositoController = async (req: Request, res: Response): Promise<Response> => {
    const { valor, usuario_id } = req.body;

    const usuarioExiste = await getUsuarioId(Number(usuario_id));
    if (!usuarioExiste) {
      throw new BadRequestError('Erro ao realizar o depósito. Usuário não encontrado.');
    }

    // Cria o depósito chamando a função do repository
    const depositoCriado = await createDeposito(valor, usuario_id);

    if (!depositoCriado){
      throw new BadRequestError('Erro ao criar o depósito');
    }

    // Retorna o depósito criado
    return res.status(201).json(depositoCriado);

};

// Cria uma transação do tipo saque
const createSaqueController = async (req: Request, res: Response): Promise<Response> => {
    const { valor, usuario_id } = req.body;

    const usuarioExiste = await getUsuarioId(Number(usuario_id));
    if (!usuarioExiste) {
      throw new BadRequestError('Erro ao realizar o saque. Usuário não encontrado.');
    }

    // Cria o saque chamando a função do repository
    const saqueCriado = await createSaque(valor, usuario_id);

    if (!saqueCriado){
      throw new BadRequestError('Erro ao criar o saque');
    }

    // Retornar o saque criado no corpo da resposta
    return res.status(201).json(saqueCriado);
};

// Busca o saldo de um usuário
const getSaldoUsuarioController = async (req: Request, res: Response): Promise<Response> => {
    const { usuario_id } = req.params;

    const saldo = await getSaldoUsuario(Number(usuario_id));

    if (saldo === undefined) {
      throw new BadRequestError('Erro ao obter o saldo do usuário');
    }
    // Retorna o saldo do usuário
    return res.status(200).json({ saldo });
};

// Busca o extrato de todas as transações do usuário
const getExtratoTransacoesUsuarioController = async (req: Request, res: Response): Promise<Response> => {
  const { usuario_id } = req.params; // data_inicio, data_fim

  const usuarioExiste = await getUsuarioId(Number(usuario_id));
  if (!usuarioExiste) {
    throw new BadRequestError('Erro ao gerar extrato de transações. Usuário não encontrado.');
  }

    const extratoTransacoes = await getExtratoTransacoesUsuario(Number(usuario_id)); // Passar data inicio e fim.
    
    // if (!extratoTransacoes) {
    //   throw new BadRequestError('Erro ao gerar extrato de transações do usuário');
    // }
    // Retorna o extrato
    return res.status(200).json(extratoTransacoes);
};

// Busca o extrato dos depoósitos do usuário
const getExtratoDepositoUsuarioController = async (req: Request, res: Response): Promise<Response> => {
  const { usuario_id } = req.params;

  const usuarioExiste = await getUsuarioId(Number(usuario_id));
  if (!usuarioExiste) {
    throw new BadRequestError('Erro ao gerar extrato de depósito. Usuário não encontrado.');
  }

  const extratoDeposito = await getExtratoDepositoUsuario(Number(usuario_id));

    // if (!extratoDeposito) {
    //   throw new BadRequestError('Erro ao gerar extrato de depósito do usuário');
    // }
    // Retorna o extrato
  return res.status(200).json(extratoDeposito);
};

// Busca o extrato dos saques do usuário
const getExtratoSaqueUsuarioController = async (req: Request, res: Response): Promise<Response> => {
  const { usuario_id } = req.params;

  const usuarioExiste = await getUsuarioId(Number(usuario_id));
  if (!usuarioExiste) {
    throw new BadRequestError('Erro ao gerar extrato de saque. Usuário não encontrado.');
  }

  const extratoSaque = await getExtratoSaqueUsuario(Number(usuario_id));

    // if (!extratoSaque) {
    //   throw new BadRequestError('Erro ao gerar extrato de saque do usuário');
    // }
    // Retorna o extrato
  return res.status(200).json(extratoSaque);
};

export default {
  createTransacaoController, 
  updateTransacaoStatusController, 
  getTransacaoByIdController, 
  deleteTransacaoController, 
  createDepositoController, 
  createSaqueController, 
  getSaldoUsuarioController,
  getExtratoTransacoesUsuarioController,
  getExtratoDepositoUsuarioController,
  getExtratoSaqueUsuarioController,
};
