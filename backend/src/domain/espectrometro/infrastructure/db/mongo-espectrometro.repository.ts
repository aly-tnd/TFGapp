import { EspectrometroEntity } from '../../entities/espectrometro.entity';
import { EspectrometroRepository } from '../../repositories/espectrometro.repository';
import { EspectrometroModel } from './models/espectrometro.model';

export class MongoEspectrometroRepository implements EspectrometroRepository {
  async guardar(entidad: EspectrometroEntity): Promise<EspectrometroEntity> {
    const nuevo = await EspectrometroModel.create({
      nombre: entidad.nombre,
      sondas: entidad.sondas
    });
    return new EspectrometroEntity(nuevo.id, nuevo.nombre, nuevo.sondas);
  }

  async obtenerTodos(): Promise<EspectrometroEntity[]> {
    const documentos = await EspectrometroModel.find();
    return documentos.map(doc => new EspectrometroEntity(doc.id, doc.nombre, doc.sondas));
  }
}