import { RegistroModel } from '../../registro.schema';
import { RegistroEntity } from '../../../../domain/entities/registro.entity';
import { RegistroMapper } from '../../../../application/mappers/registro.mapper';
import { RegistroRepository } from '../../../../domain/repositories/registro.repository';

export class MongoRegistroRepository implements RegistroRepository {

  async findByUserId(userId: string): Promise<RegistroEntity[]> {
    const registros = await RegistroModel.find({ usuario_id: userId }).lean();
    return registros.map(reg => RegistroMapper.toEntity(reg as any));
  }

  async findAll(): Promise<RegistroEntity[]> {
    const registros = await RegistroModel.find().lean();
    return registros.map(reg => RegistroMapper.toEntity(reg as any));
  }

  async crear(registroData: any): Promise<any> {
    const nuevo = new RegistroModel(registroData);
    return await nuevo.save();
  }
}
