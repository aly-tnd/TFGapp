import { EdicionModel } from '../../edicion.schema';
import { EdicionEntity } from '../../../../domain/entities/edicion.entity';
import { EdicionMapper } from '../../../../application/mappers/edicion.mapper';
import { EdicionRepository } from '../../../../domain/repositories/edicion.repository';

export class MongoEdicionRepository implements EdicionRepository {
  async crear(data: any): Promise<any> {
    const nueva = new EdicionModel({ ...data, fecha_edicion: new Date() });
    return await nueva.save();
  }

  async findByRegistroId(registroId: string): Promise<EdicionEntity[]> {
    const docs = await EdicionModel
      .find({ registro_id: registroId })
      .sort({ fecha_edicion: -1 })
      .lean();
    return docs.map(d => EdicionMapper.toEntity(d as any));
  }
}
