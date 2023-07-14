import Usuario from "../app/entities/Usuario";
import IUsuario from "../app/interface/IUsuario";

declare global {
    namespace Express {
        export interface Request {
            usuarioId: number;
            usuario: Partial<IUsuario>;
        }
    }
}