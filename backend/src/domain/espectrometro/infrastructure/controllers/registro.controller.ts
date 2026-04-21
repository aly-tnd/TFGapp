import { Request, Response } from 'express';
import { RegistroModel } from '../db/models/registro.model';


export class RegistroController {
  crear = async (req: Request, res: Response) => {
    try {
      const nuevo = await RegistroModel.create(req.body);
      res.status(201).json(nuevo);
    } catch (error) {
      res.status(500).json({ error: 'Error al registrar muestra' });
    }
  };
}