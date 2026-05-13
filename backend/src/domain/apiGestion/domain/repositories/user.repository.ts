import { UserEntity } from "../entities/user.entity";

export interface UserRepository {
  save(user: UserEntity): Promise<UserEntity>;
  findAll(): Promise<UserEntity[]>;
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<any>;
  borrar(id: string): Promise<void>;
  updateById(id: string, data: Partial<{ username: string; password: string }>): Promise<void>;
}