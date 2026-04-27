import { RegistroModel } from "../../registro.schema"; // Ajusta ruta
import { RegistroEntity } from "../../../../domain/entities/registro.entity";
import { RegistroMapper } from "../../../../application/mappers/registro.mapper";

export class MongoRegistroRepository {
  
  async findByUserId(userId: string): Promise<RegistroEntity[]> {
    const registros = await RegistroModel.find({ usuario_id: userId }).lean();
    return registros.map(reg => RegistroMapper.toEntity(reg));
  }

  // 👇 NUEVO MÉTODO PARA GUARDAR LA MUESTRA 👇
  async crear(registroData: any): Promise<any> {
    const nuevoRegistro = new RegistroModel(registroData);
    return await nuevoRegistro.save();
  }
  
}