import { Types } from 'mongoose';
import { IEdicion } from '../../infrastructure/db/edicion.schema';
import { EdicionEntity } from '../../domain/entities/edicion.entity';

export interface EdicionRaw extends IEdicion { _id: Types.ObjectId; }

export class EdicionMapper {
  static toEntity(doc: EdicionRaw): EdicionEntity {
    return new EdicionEntity(
      doc._id.toString(),
      doc.registro_id.toString(),
      doc.usuario_id,
      doc.fecha_edicion,
      doc.secuencia,
      doc.secuencia_otro,
      doc.solvente,
      doc.solvente_otro,
      doc.concentracion_estimada,
      doc.estado_muestra,
      doc.proposito,
      doc.proposito_otro,
      doc.incidencias,
      doc.incidencias_otro,
      doc.descripcion_incidencias,
      doc.repetida_adquisicion,
      doc.observaciones
    );
  }
}
