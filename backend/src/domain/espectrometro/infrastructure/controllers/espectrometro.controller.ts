import { Request, Response } from 'express';
import { CrearEspectrometroUseCase } from '../../application/use-cases/crear-espectrometro.use-case';
import { ListarEspectrometrosUseCase } from '../../application/use-cases/listar-espectrometros.use-case';


export class EspectrometroController {
  constructor(
    private readonly crearUseCase: CrearEspectrometroUseCase,
    private readonly listarUseCase: ListarEspectrometrosUseCase
  ) {}

  crear = async (req: Request, res: Response) => {
    try {
      const resultado = await this.crearUseCase.ejecutar(req.body);
      res.status(201).json(resultado);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el espectrómetro' });
    }
  };

  listar = async (_req: Request, res: Response) => {
    try {
      const resultado = await this.listarUseCase.ejecutar();
      res.status(200).json(resultado);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la lista' });
    }
  };
}