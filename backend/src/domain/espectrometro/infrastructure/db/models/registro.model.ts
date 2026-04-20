import { Schema, model, Document, Types } from 'mongoose';
import { IEspectrometro } from './espectrometro.model';

export interface IRegistro extends Document {
  espectrometro: Types.ObjectId | IEspectrometro;
  sonda: string;
  fechaEntrada: Date;
  usuarioEntrada: string;
  muestra: string;
  idSolicitud: string;
  finalizado: boolean;
  recuperarMuestra: boolean;
  fechaSalida?: Date;
  usuarioSalida?: string;
}

const registroSchema = new Schema<IRegistro>({
  espectrometro: { type: Schema.Types.ObjectId, ref: 'Espectrometro', required: true },
  sonda: { type: String, required: true },
  fechaEntrada: { type: Date, default: Date.now },
  usuarioEntrada: { type: String, required: true },
  muestra: { type: String, required: true },
  idSolicitud: { type: String, required: true }, 
  finalizado: { type: Boolean, default: false }, 
  recuperarMuestra: { type: Boolean, default: false },
  fechaSalida: { type: Date },
  usuarioSalida: { type: String }
});

export const RegistroModel = model<IRegistro>('Registro', registroSchema);