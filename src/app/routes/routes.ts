import { Router } from "express";
import usuarioRouter from "../controllers/UsuarioController";
import AuthController from "../controllers/AuthController";
import IndexController from "../controllers/IndexController";
import { authMiddleware } from "../middleware/authMiddleware";

const routers = Router();

// routers.get('/', async (req, res, next) => {
//     throw new BadRequestError('Erro lançado do API Error.');
//     // try {
//     //     throw new UnauthorizedError('Erro lançado do ApiError.');
//     // } catch (error) {
//     //     next(error);
//     // }
    
//     // return res.json('OK');
//     // try {
//     //     // const file = fs.readFileSync('teste.txt');
//     //     // return res.json(file.toString());
//     //     throw new Error('Erro de teste.');
//     // } catch (error) {
//     //     // return res.status(500).json(error);
//     //     console.log(error);
//     // }
// });

routers.use('/usuarios', usuarioRouter);
routers.use('/login', AuthController.login);
routers.use('/usuario', authMiddleware, IndexController.index);
routers.use('/perfil', authMiddleware, AuthController.getPerfil);

export default routers;
