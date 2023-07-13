import { Router } from "express";
import usuarioRouter from "../controllers/UsuarioController";
import AuthController from "../controllers/AuthController";
import IndexController from "../controllers/IndexController";
import authMiddleware from "../middleware/authMiddleware";

const routers = Router();

// routers.get('/', (req, res) => {
//     try {
//         const file = fs.readFile
//     } catch {

//     }
// });

routers.use('/usuarios', usuarioRouter);
routers.use('/auth', AuthController.authenticate);
routers.use('/usuario', authMiddleware, IndexController.index);

export default routers;
