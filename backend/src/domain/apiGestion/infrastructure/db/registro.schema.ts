import { Schema, model, Types } from 'mongoose';

export interface IRegistro {
  espectrometro: string;
  espectrometro_id?: Types.ObjectId;
  sonda: string;
  usuario_id: string;
  fecha_entrada: Date;
  muestra: string;
  completo: boolean;
}

const RegistroSchema = new Schema<IRegistro>({
  espectrometro:    { type: String, required: true },
  espectrometro_id: { type: Schema.Types.ObjectId, ref: 'Espectrometro' },
  sonda:            { type: String, required: true },
  usuario_id:       { type: String, required: true },
  fecha_entrada:    { type: Date, default: Date.now },
  muestra:          { type: String, required: true },
  completo:         { type: Boolean, default: false }
});

export const RegistroModel = model<IRegistro>('Registro', RegistroSchema);
