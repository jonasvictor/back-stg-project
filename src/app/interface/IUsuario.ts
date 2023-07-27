import ITransacao from "./ITransacao";

interface IUsuario {
    id?: number;
    name: string;
    email: string;
    senha?: string;
    transacoes?: ITransacao[];
}

export default IUsuario;
