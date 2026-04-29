import { RegistroEntity } from '../entities/registro.entity';

export interface RegistroRepository {
  findByUserId(userId: string): Promise<RegistroEntity[]>;
}