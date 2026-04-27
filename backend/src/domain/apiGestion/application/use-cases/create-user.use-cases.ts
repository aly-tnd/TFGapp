import { UserEntity } from "../../domain/entities/user.entity";
import { UserRepository } from "../../domain/repositories/user.repository";

export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  // Ahora recibe el usuario completo con todos sus datos
  async execute(user: UserEntity): Promise<UserEntity> {
    // Lo enviamos directo a guardar, sin cortarle la contraseña
    return await this.userRepository.save(user);
  }
}