import { EdicionEntity } from '../entities/edicion.entity';

export interface EdicionRepository {
  crear(data: any): Promise<any>;
  findByRegistroId(registroId: string): Promise<EdicionEntity[]>;
}
