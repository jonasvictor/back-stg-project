export class ApiError extends Error {
    public readonly statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}

export class BadRequestError extends ApiError {
    constructor(message: string) {
        super(message, 400); // Requisição inválida
    }
}

export class UnauthorizedError extends ApiError {
    constructor(message: string) {
        super(message, 401); // Não autorizado
    }
}

export class ForbiddenError extends ApiError {
    constructor(message: string) {
        super(message, 403); // Acesso proibido
    }
}

export class NotFoundError extends ApiError {
    constructor(message: string) {
        super(message, 404); // Dados não encontrado
    }
}

export class InternalServerError extends ApiError {
    constructor(message: string) {
        super(message, 500); // Erro interno do servidor
    }
}
