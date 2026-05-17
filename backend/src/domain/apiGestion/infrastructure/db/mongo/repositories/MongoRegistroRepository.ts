import { RegistroModel } from '../../registro.schema';
import { RegistroEntity } from '../../../../domain/entities/registro.entity';
import { RegistroMapper } from '../../../../application/mappers/registro.mapper';
import { RegistroRepository } from '../../../../domain/repositories/registro.repository';

export class MongoRegistroRepository implements RegistroRepository {

  async findByUserId(userId: string): Promise<RegistroEntity[]> {
    const docs = await RegistroModel.find({ usuario_id: userId })
      .sort({ solicitud_id: 1 })
      .lean();
    return docs.map(d => RegistroMapper.toEntity(d as any));
  }

  async findAll(): Promise<RegistroEntity[]> {
    const docs = await RegistroModel.find().sort({ usuario_id: 1, solicitud_id: 1 }).lean();
    return docs.map(d => RegistroMapper.toEntity(d as any));
  }

  async crear(registroData: any): Promise<any> {
    // Asigna solicitud_id incremental independiente por usuario
    const count = await RegistroModel.countDocuments({ usuario_id: registroData.usuario_id });
    const nuevo = new RegistroModel({ ...registroData, solicitud_id: count + 1 });
    return await nuevo.save();
  }
}
