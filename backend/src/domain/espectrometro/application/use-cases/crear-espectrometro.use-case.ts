import { EspectrometroEntity } from '../../entities/espectrometro.entity';
import { EspectrometroRepository } from '../../repositories/espectrometro.repository';
import { CrearEspectrometroDto } from '../dtos/crear-espectrometro.dto';

export class CrearEspectrometroUseCase {
  constructor(private readonly repository: EspectrometroRepository) {}

  async ejecutar(dto: CrearEspectrometroDto): Promise<EspectrometroEntity> {
    const entidad = new EspectrometroEntity(null, dto.nombre, dto.sondas);
    return await this.repository.guardar(entidad);
  }
}