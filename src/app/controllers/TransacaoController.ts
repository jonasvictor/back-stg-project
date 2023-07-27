import { Request, Response } from 'express';
import ITransacao from '../interface/ITransacao';
import { BadRequestError, NotFoundError } from '../helpers/api-erros';
import { createDeposito, createSaque, createTransacao, deleteTransacao, getExtratoDepositoUsuario, getExtratoSaqueUsuario, getExtratoTransacoesUsuario, getSaldoUsuario, getTransacaoById, updateTransacaoStatus } from '../repositories/TransacaoRepository';

// Cria uma transação
const createTransacaoController = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { tipo_id, status_id, valor, data, usuario_id }: ITransacao = req.body;

    // Criar a transação chamando a função do repository
    const transacaoCriada: ITransacao = await createTransacao({ tipo_id, status_id, valor, data, usuario_id });

    // Retorna a transação
    return res.status(201).json(transacaoCriada);

  } catch (error) {
    console.error('Não criou a Transação' ,error);

    return res.status(500).json({ message: 'Erro ao criar a transação' });
  }
};

// Atualiza o status de uma transação
const updateTransacaoStatusController = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { status_id } = req.body;

    // Atualizar o status da transação chamando a função do repository
    const transacaoAtualizada = await updateTransacaoStatus(Number(id), status_id);

    if (!transacaoAtualizada) {
      throw new NotFoundError('A transação não foi encontrada.');
    }

    // Retorna a transação atualizada
    console.log('Transação Atualizada', transacaoAtualizada);
    return res.status(200).json(transacaoAtualizada);

  } catch (error) {
    return res.status(500).json({ message: 'Erro ao atualizar o status da transação' });
  }
};

// Busca uma transação pelo seu ID
const getTransacaoByIdController = async (req: Request, res: Response): Promise<Response> => {
  try {
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

  } catch (error) {
    return res.status(500).json({ message: 'Erro ao obter a transação pelo ID.' });
  }
};

// Exclui uma transação pelo seu ID
const deleteTransacaoController = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    // Exclui a transação chamando a função do repository
    const transacaoExcluida = await deleteTransacao(Number(id));

    // Verifica se a transação foi encontrada
    if (!transacaoExcluida) {
      throw new NotFoundError('A transação não foi encontrada.');
    }

    return res.status(200).json({ message: 'Transação excluída com sucesso.' });

  } catch (error) {
    return res.status(500).json({ message: 'Erro ao excluir a transação.' });
  }
};

// Cria uma transação do tipo depósito
const createDepositoController = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { valor, usuario_id } = req.body;

    // Cria o depósito chamando a função do repository
    const depositoCriado = await createDeposito(valor, usuario_id);

    // Retorna o depósito criado
    return res.status(201).json(depositoCriado);
  } catch (error) {
    console.error('Erro no Depósito' ,error);

    throw new BadRequestError('Erro ao criar o depósito');
  }
};

// Cria uma transação do tipo saque
const createSaqueController = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { valor, usuario_id } = req.body;

    // Cria o saque chamando a função do repository
    const saqueCriado = await createSaque(valor, usuario_id);

    // Retornar o saque criado no corpo da resposta
    return res.status(201).json(saqueCriado);
  } catch (error) {
    console.error('Erro no Saque' ,error);

    throw new BadRequestError('Erro ao criar o saque');
  }
};

// Busca o saldo de um usuário
const getSaldoUsuarioController = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { usuario_id } = req.params;

    const saldo = await getSaldoUsuario(Number(usuario_id));

    if (saldo === undefined) {
      throw new NotFoundError('O usuário não foi encontrado.');
    }

    // Retorna o saldo do usuário
    return res.status(200).json({ saldo });
  } catch (error) {
    console.error('Erro em buscar o Saldo' ,error);

    throw new BadRequestError('Erro ao obter o saldo do usuário');
  }
};

// Busca o extrato de todas as transações do usuário
const getExtratoTransacoesUsuarioController = async (req: Request, res: Response): Promise<Response> => {
  const { usuario_id } = req.params;

  try {
    const extratoTransacoes = await getExtratoTransacoesUsuario(Number(usuario_id));

    // Retorna o extrato
    return res.status(200).json(extratoTransacoes);
  } catch (error) {
    console.error('Erro ao buscar o Extrato de Transações:', error);
    throw new BadRequestError('Erro ao obter o extrato de transações do usuário');
  }
};

// Busca o extrato dos depoósitos do usuário
const getExtratoDepositoUsuarioController = async (req: Request, res: Response): Promise<Response> => {
  const { usuario_id } = req.params;

  try {
    const extratoDeposito = await getExtratoDepositoUsuario(Number(usuario_id));

    // Retorna o extrato
    return res.status(200).json(extratoDeposito);
  } catch (error) {
    console.error('Erro ao buscar o Extrato de Depósito:', error);
    throw new BadRequestError('Erro ao obter o extrato de depósito do usuário');
  }
};

// Busca o extrato dos saques do usuário
const getExtratoSaqueUsuarioController = async (req: Request, res: Response): Promise<Response> => {
  const { usuario_id } = req.params;

  try {
    const extratoSaque = await getExtratoSaqueUsuario(Number(usuario_id));

    // Retorna o extrato
    return res.status(200).json(extratoSaque);
  } catch (error) {
    console.error('Erro ao buscar o Extrato de Saque:', error);
    throw new BadRequestError('Erro ao obter o extrato de saque do usuário');
  }
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
