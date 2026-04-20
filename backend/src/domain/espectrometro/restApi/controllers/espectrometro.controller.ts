import { Request, Response } from 'express';
import { CrearEspectrometroUseCase } from '../../application/use-cases/crear-espectrometro.use-case';


export class EspectrometroController {
  constructor(private readonly crearUseCase: CrearEspectrometroUseCase) {}

  crear = async (req: Request, res: Response) => {
    try {
      const resultado = await this.crearUseCase.ejecutar(req.body);
      res.status(201).json(resultado);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear' });
    }
  };
}