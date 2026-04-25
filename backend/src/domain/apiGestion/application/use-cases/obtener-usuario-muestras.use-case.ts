import { UserRepository } from "../../domain/repositories/user.repository";
import { RegistroRepository } from "../../domain/repositories/registro.repository";

export class ObtenerUsuarioYMuestrasUseCase {
  constructor(
    private userRepository: UserRepository,
    private registroRepository: RegistroRepository
  ) {}

  async execute(userId: string) {
    const usuario = await this.userRepository.findById(userId);
    if (!usuario) throw new Error("Usuario no encontrado");

    const muestras = await this.registroRepository.findByUserId(userId);
    
    return { usuario, muestras };
  }
}