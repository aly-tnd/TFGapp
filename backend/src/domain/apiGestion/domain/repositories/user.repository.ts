import { UserEntity } from "../entities/user.entity";

export interface UserRepository {
  save(user: UserEntity): Promise<UserEntity>;
  findAll(): Promise<UserEntity[]>;

  findById(id: string): Promise<UserEntity | null>;

}