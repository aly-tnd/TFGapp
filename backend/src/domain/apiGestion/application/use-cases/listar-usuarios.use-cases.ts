import { UserRepository } from "../../domain/repositories/user.repository";

export class ListUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}
  async execute() { return await this.userRepository.findAll(); }
}