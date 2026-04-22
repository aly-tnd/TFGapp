import { UserEntity } from "../entities/user.entity";

export interface UserRepository {
  save(user: UserEntity): Promise<UserEntity>;
  
  // Añadimos el método para listar aquí:
  findAll(): Promise<UserEntity[]>; 
}