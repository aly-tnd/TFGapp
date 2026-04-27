import { Request, Response } from 'express';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-cases';
import { MongoUserRepository } from '../../infrastructure/db/mongo/repositories/mongo-user.repository';
import { ListUsersUseCase } from '../../application/use-cases/listar-usuarios.use-cases';
import { UserEntity } from '../../domain/entities/user.entity'; // Importa la entidad
import { MongoRegistroRepository } from '../../infrastructure/db/mongo/repositories/MongoRegistroRepository';
import { ObtenerUsuarioYMuestrasUseCase } from '../../application/use-cases/obtener-usuario-muestras.use-case';

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

  async getUserAndMuestras(req: Request, res: Response) {
    try {
      const userId = String(req.params.id);
      // Instanciamos los repositorios
      const userRepo = new MongoUserRepository();
      const registroRepo = new MongoRegistroRepository();

      // Pasamos las dependencias al caso de uso
      const useCase = new ObtenerUsuarioYMuestrasUseCase(userRepo, registroRepo);

      // Ejecutamos la lógica
      const data = await useCase.execute(userId);

      return res.status(200).json(data);
    } catch (error: unknown) {
      console.error("❌ Error al obtener usuario y muestras:", error);
      
      if (error instanceof Error && error.message === "Usuario no encontrado") {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
  async createRegistro(req: Request, res: Response) {
      try {
        const registroRepo = new MongoRegistroRepository();
        
        // Extraemos los datos enviados desde Angular
        const registroData = req.body;

        // Aquí asumimos que tienes un método 'crear' o 'save' en tu MongoRegistroRepository
        // Ajusta el nombre del método ('crear', 'save', 'insert') según lo tengas definido en tu repo
        const result = await registroRepo.crear(registroData); 

        return res.status(201).json(result);
      } catch (error) {
        console.error("❌ Error al crear registro:", error);
        return res.status(500).json({ error: 'Error al crear registro en la base de datos' });
      }
    }

    async deleteUser(req: Request, res: Response) {
    try {
      const userId = String(req.params.id);
      const repo = new MongoUserRepository();
      
      await repo.borrar(userId); 
      
      return res.status(200).json({ message: 'Usuario borrado correctamente' });
    } catch (error) {
      console.error("❌ Error al borrar usuario:", error);
      return res.status(500).json({ error: 'Error al borrar el usuario' });
    }
  }
    }