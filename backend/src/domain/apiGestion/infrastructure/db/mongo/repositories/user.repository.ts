import { UserEntity } from "../../../../domain/entities/user.entity";


export interface UserRepository {
  save(user: UserEntity): Promise<UserEntity>;
}

