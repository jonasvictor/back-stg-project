import { Router } from "express";
import usuarioRouter from "../controllers/UsuarioController";
import AuthController from "../controllers/AuthController";
import { authMiddleware } from "../middleware/authMiddleware";
import TransacaoController from "../controllers/TransacaoController";

const routers = Router();

// Rota para login e logout
routers.use('/login', AuthController.login);
routers.use('/logout', AuthController.logout);

// Rota para criar um novo usuário, listar todos os usuários e buscar um usuário pelo ID, atualizar e excluir um usuário
routers.use('/usuarios', usuarioRouter);

// Rotas para as transações
routers.post('/transacoes', TransacaoController.createTransacaoController);
routers.get('/transacoes/:id', TransacaoController.getTransacaoByIdController);
routers.put('/transacoes/:id', TransacaoController.updateTransacaoStatusController);
routers.delete('/transacoes/:id', TransacaoController.deleteTransacaoController);

// Rota para realizar o depósito
routers.post('/transacoes/deposito', TransacaoController.createDepositoController);

// Rota para realizar o saque
routers.post('/transacoes/saque', TransacaoController.createSaqueController);

// Rota para obter o saldo do usuário
routers.get('/saldo/:usuario_id', TransacaoController.getSaldoUsuarioController);

// Rota para obter o extrato do usuário
routers.get('/extrato/:usuario_id', TransacaoController.getExtratoTransacoesUsuarioController);

// Rota para obter o extrato do usuário (depósito)
routers.get('/extrato/deposito/:usuario_id', TransacaoController.getExtratoDepositoUsuarioController);

// Rota para obter o extrato do usuário (saque)
routers.get('/extrato/saque/:usuario_id', TransacaoController.getExtratoSaqueUsuarioController);


// Rota para obter o perfil do usuário autenticado
routers.use('/perfil', authMiddleware, AuthController.getPerfil);

export default routers;
