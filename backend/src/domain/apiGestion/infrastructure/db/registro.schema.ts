import { Schema, model } from 'mongoose';

// 1. Interfaz pura (sin extends Document)
export interface IRegistro {
  espectrometro: string;
  sonda: string;
  usuario_id: string;
  fecha_entrada: Date;
  muestra: string;
  completo: boolean;
}

// 2. El resto se queda igual
const RegistroSchema = new Schema<IRegistro>({
  espectrometro: { type: String, required: true },
  sonda: { type: String, required: true },
  usuario_id: { type: String, required: true },
  fecha_entrada: { type: Date, default: Date.now },
  muestra: { type: String, required: true },
  completo: { type: Boolean, default: false }
});

export const RegistroModel = model<IRegistro>('Registro', RegistroSchema);