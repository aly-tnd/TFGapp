import { Schema, model, Document } from 'mongoose';

export interface IEspectrometro extends Document {
  nombre: string;
  sondas: string[]; 
}

const espectrometroSchema = new Schema<IEspectrometro>({
  nombre: { type: String, required: true, unique: true },
  sondas: [{ type: String }] 
});

export const EspectrometroModel = model<IEspectrometro>('Espectrometro', espectrometroSchema);