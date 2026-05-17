import { Types } from 'mongoose';
import { IRegistro } from '../../infrastructure/db/registro.schema';
import { RegistroEntity } from '../../domain/entities/registro.entity';

export interface RegistroRaw extends IRegistro {
  _id: Types.ObjectId;
}

export class RegistroMapper {
  static toEntity(doc: RegistroRaw): RegistroEntity {
    return new RegistroEntity(
      doc._id.toString(),
      doc.espectrometro,
      doc.sonda,
      doc.usuario_id,
      doc.fecha_entrada,
      doc.muestra,
      doc.completo,
      doc.espectrometro_id?.toString(),
      doc.solicitud_id
    );
  }
}
