import { UserEntity } from "../../domain/entities/user.entity";
import { UserRepository } from "../../domain/repositories/user.repository";


export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(data: { nombre: string; email: string }): Promise<UserEntity> {
    const newUser = new UserEntity(data.nombre, data.email);
    return await this.userRepository.save(newUser);
  }
}