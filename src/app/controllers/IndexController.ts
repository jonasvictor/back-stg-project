import { Request, Response } from "express";

class IndexController {
    index(req: Request, res: Response) {
        return res.send({ usuarioId: req.usuarioId });
      };
}

export default new IndexController();