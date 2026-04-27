import { Types } from 'mongoose';
import { IRegistro } from '../../infrastructure/db/registro.schema';
import { RegistroEntity } from '../../domain/entities/registro.entity';


// Definimos exactamente lo que devuelve .lean()
export interface RegistroRaw extends IRegistro {
  _id: Types.ObjectId;
}

export class RegistroMapper {
  static toEntity(registroDb: RegistroRaw): RegistroEntity {
    return new RegistroEntity(
      registroDb._id.toString(),
      registroDb.espectrometro,
      registroDb.sonda,
      registroDb.usuario_id,
      registroDb.fecha_entrada,
      registroDb.muestra,
      registroDb.completo
    );
  }
}