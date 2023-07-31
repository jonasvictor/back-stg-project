import { AppDataSource } from '../../database/data-source';
import Transacao from '../entities/Transacao';
import { BadRequestError, NotFoundError } from '../helpers/api-erros';
import ITransacao from '../interface/ITransacao';

const transacaoRepository = AppDataSource.getRepository(Transacao);

// Função para criar uma nova transação
const createTransacao = async (transacao: ITransacao): Promise<ITransacao> => {
  // Cria uma nova instância de Transacao com os dados recebidos
  const novaTransacao: Transacao = transacaoRepository.create(transacao);

  // Salva a nova instância de Transacao no db
  const transacaoCriada: Transacao = await transacaoRepository.save(novaTransacao);

  return {
    id: transacaoCriada.id,
    tipo_id: transacaoCriada.tipo_id,
    status_id: transacaoCriada.status_id,
    valor: transacaoCriada.valor,
    data: transacaoCriada.data,
    usuario_id: transacaoCriada.usuario_id,
  };
};

// Função para atualizar o status de uma transação
const updateTransacaoStatus = async (id: number, status: number): Promise<ITransacao | null> => {
  // Busca a transação pelo ID no db
  const transacaoExistente: Transacao | null = await transacaoRepository.findOne({ where: { id } });

  // Verifica se a transação foi encontrada
  if (!transacaoExistente) {
    throw new NotFoundError('A transação não foi encontrada.');
  }

  // Atualiza o status da transação
  transacaoExistente.status_id = status;

  // Salva as alterações no db
  await transacaoRepository.save(transacaoExistente);

  // Retorna os dados atualizados da transação
  return {
    id: transacaoExistente.id,
    tipo_id: transacaoExistente.tipo_id,
    status_id: transacaoExistente.status_id,
    valor: transacaoExistente.valor,
    data: transacaoExistente.data,
    usuario_id: transacaoExistente.usuario_id,
  };
};

// Função para obter uma transação pelo seu ID
const getTransacaoById = async (id: number): Promise<ITransacao | undefined> => {
  // Buscar a transação pelo ID no db
  const transacao: Transacao | undefined | null = await transacaoRepository.findOne({ where: { id } });

  if (!transacao) {
    return undefined;
  }

  // Retorna a transação encontrada -> (ITransacao)
  return {
    id: transacao.id,
    tipo_id: transacao.tipo_id,
    status_id: transacao.status_id,
    valor: transacao.valor,
    data: transacao.data,
    usuario_id: transacao.usuario_id,
  };
};

// Função para excluir uma transação pelo seu ID
const deleteTransacao = async (id: number): Promise<ITransacao | null> => {
  // Buscar a transação pelo ID no db
  const transacaoExistente: Transacao | null = await transacaoRepository.findOne({ where: { id } });

  // Verificar se a transação foi encontrada
  if (!transacaoExistente) {
    return null;
  }

  // Exclui a transação
  await transacaoRepository.delete(id);

  // Retorna a transação excluída -> (ITransacao)
  return {
    id: transacaoExistente.id,
    tipo_id: transacaoExistente.tipo_id,
    status_id: transacaoExistente.status_id,
    valor: transacaoExistente.valor,
    data: transacaoExistente.data,
    usuario_id: transacaoExistente.usuario_id,
  };
};


// Função para criar uma transação do tipo depósito
const createDeposito = async (valor: number, usuario_id: number): Promise<ITransacao | null> => {

  const valorDeposito: number = valor;
  if (valorDeposito <= 0) {
    throw new BadRequestError('O valor do depósito deve ser maior que zero.');
  }
  
  // Cria o depósito
  const deposito: ITransacao = await createTransacao({
    tipo_id: 3, // Depósito
    status_id: 2, // Concluído
    valor: valor,
    data: new Date(),
    usuario_id,
  });
  
  // Salva o depósito
  await transacaoRepository.save(deposito);
  
  // Retorna o depósito
  return {
    id: deposito.id,
    tipo_id: deposito.tipo_id,
    status_id: deposito.status_id,
    valor: deposito.valor,
    data: deposito.data,
    usuario_id: deposito.usuario_id,
  };
};

// Função para criar uma transação do tipo saque
const createSaque = async (valor: number, usuario_id: number): Promise<ITransacao | null> => {

  // Busca saldo atual do usuário
  const saldoAtual: number = await getSaldoUsuario(usuario_id) || 0;
  
  // Verifica se o saldo é suficiente para realizar o saque
  if (valor > saldoAtual || valor <= 0) {
    throw new BadRequestError('O valor do saque não pode ser acima do seu saldo atual.');
  } 
  
  // Cria o saque
  const saque: ITransacao = await createTransacao({
    tipo_id: 2,
    status_id: 1,
    valor: valor * -1,
    data: new Date(),
    usuario_id,
  });
  
  // Salva o saque
  await transacaoRepository.save(saque);
  
  // Retorna o saque
  return {
    id: saque.id,
    tipo_id: saque.tipo_id,
    status_id: saque.status_id,
    valor: saque.valor,
    data: saque.data,
    usuario_id: saque.usuario_id,
  };
  // return saque;
};
  
// Busca o saldo de um usuário
const getSaldoUsuario = async (usuario_id: number): Promise<number | undefined> => {

  // Busca todas as transações concluídas do usuário pelo ID no db
  const transacoesConcluidas = await transacaoRepository.find({ where: { usuario_id, status_id: 2 } });
  
  // Calcula o saldo somando os valores das transações concluídas do usuário
  let saldo = 0;
  for (const transacao of transacoesConcluidas) {
    saldo += parseFloat(transacao.valor.toString());
  }
  
  return saldo;
};

// Busca o extrato de todas as transações do usuário
const getExtratoTransacoesUsuario = async (usuario_id: number): Promise<ITransacao[]> => {
  // Busca todas as transações do usuário pelo ID no db
  const extratoTransacoes = await transacaoRepository.find({
    where: { usuario_id }, // Passar Data inicio e fim
    relations: ['usuario'],
    select: ['data', 'id', 'valor', 'usuario_id', 'status_id', 'tipo_id'],
    order: { data: 'ASC' },
  });

  return extratoTransacoes.map((transacao) => ({
    ...transacao,
    usuario: {
      id: transacao.usuario.id,
      name: transacao.usuario.name,
      email: transacao.usuario.email,
    },
  }));
};

// Busca o extrato dos depósitos de um usuário
const getExtratoDepositoUsuario = async (usuario_id: number): Promise<ITransacao[]> => {
  // Busca todas as transações de depósito do usuário pelo ID no db
  const extratoDeposito = await transacaoRepository.find({
    where: { usuario_id, tipo_id: 3 }, // Tipo 3 depósito
    relations: ['usuario'],
    select: ['data', 'id', 'valor', 'usuario_id', 'status_id', 'tipo_id'],
    order: { data: 'ASC' },
  });

  return extratoDeposito.map((transacao) => ({
    ...transacao,
    usuario: {
      id: transacao.usuario.id,
      name: transacao.usuario.name,
      email: transacao.usuario.email,
    },
  }));
  // return extratoDeposito;
};

// Busca extrato dos saques de um usuário
const getExtratoSaqueUsuario = async (usuario_id: number): Promise<ITransacao[]> => {
  // Busca todas as transações de saque do usuário pelo ID no db
  const extratoSaque = await transacaoRepository.find({
    where: { usuario_id, tipo_id: 2 }, // Tipo 2 saque
    relations: ['usuario'],
    select: ['data', 'id', 'valor', 'usuario_id', 'status_id', 'tipo_id'],
    order: { data: 'ASC' },
  });

  return extratoSaque.map((transacao) => ({
    ...transacao,
    usuario: {
      id: transacao.usuario.id,
      name: transacao.usuario.name,
      email: transacao.usuario.email,
    },
  }));

  // return extratoSaque;
};
  
export { 
  createTransacao, 
  updateTransacaoStatus, 
  getTransacaoById, 
  deleteTransacao, 
  getSaldoUsuario, 
  createDeposito, 
  createSaque, 
  getExtratoTransacoesUsuario,
  getExtratoDepositoUsuario, 
  getExtratoSaqueUsuario
};
