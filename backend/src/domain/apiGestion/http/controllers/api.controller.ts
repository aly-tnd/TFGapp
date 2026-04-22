import { Request, Response } from 'express';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-cases';
import { MongoUserRepository } from '../../infrastructure/db/mongo/repositories/mongo-user.repository';
import { ListUsersUseCase } from '../../application/use-cases/listar-usuarios.use-cases';
import { UserEntity } from '../../domain/entities/user.entity'; // Importa la entidad

export class ApiController {
  async create(req: Request, res: Response) {
    try {
      const repo = new MongoUserRepository();
      const useCase = new CreateUserUseCase(repo);

      // 1. Extraemos los datos que vienen de Angular (que usa 'name')
      const { name, email } = req.body;

      // 2. Creamos una instancia real de la Entidad
      // El primer parámetro es 'nombre', así que le pasamos 'name'
      const userEntity = new UserEntity(name, email);

      // 3. Pasamos la ENTIDAD al caso de uso, no el body crudo
      const result = await useCase.execute(userEntity);

      return res.status(201).json(result);
    } catch (error) {
      console.error("❌ Error detallado en el Backend:", error); // Esto saldrá en docker logs
      return res.status(500).json({ error: 'Error al crear usuario en la base de datos' });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const repo = new MongoUserRepository();
      const useCase = new ListUsersUseCase(repo);
      const users = await useCase.execute();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Error al listar usuarios' });
    }
  }
}