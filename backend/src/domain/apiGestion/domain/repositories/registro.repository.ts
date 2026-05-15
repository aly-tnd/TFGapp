import { RegistroEntity } from '../entities/registro.entity';

export interface RegistroRepository {
  findByUserId(userId: string): Promise<RegistroEntity[]>;
  findAll(): Promise<RegistroEntity[]>;
  crear(data: any): Promise<any>;
}
