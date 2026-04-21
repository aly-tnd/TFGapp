import { EspectrometroRepository } from "../../repositories/espectrometro.repository";

export class ListarEspectrometrosUseCase {
  constructor(private readonly repository: EspectrometroRepository) {}

  async ejecutar() {
    return await this.repository.obtenerTodos();
  }
}