import { EspectrometroEntity } from '../entities/espectrometro.entity';

export interface EspectrometroRepository {
  guardar(espectrometro: EspectrometroEntity): Promise<EspectrometroEntity>;
  obtenerTodos(): Promise<EspectrometroEntity[]>;
}