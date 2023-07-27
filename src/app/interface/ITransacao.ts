interface ITransacao {
    id?: number;
    usuario_id: number;
    tipo_id: number;
    status_id: number;
    valor: number;
    data: Date;
}

export default ITransacao;