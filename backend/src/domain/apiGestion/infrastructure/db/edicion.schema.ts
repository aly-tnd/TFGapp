import { Schema, model, Types } from 'mongoose';

export interface IEdicion {
  registro_id: Types.ObjectId;
  usuario_id:  string;
  fecha_edicion: Date;
  secuencia?:              string;
  secuencia_otro?:         string;
  solvente?:               string;
  solvente_otro?:          string;
  concentracion_estimada?: string;
  estado_muestra?:         string;
  proposito?:              string;
  proposito_otro?:         string;
  incidencias?:            string[];
  incidencias_otro?:       string;
  descripcion_incidencias?: string;
  repetida_adquisicion?:   string;
  observaciones?:          string;
}

const EdicionSchema = new Schema<IEdicion>({
  registro_id:              { type: Schema.Types.ObjectId, ref: 'Registro', required: true },
  usuario_id:               { type: String, required: true },
  fecha_edicion:            { type: Date, default: Date.now },
  secuencia:                { type: String },
  secuencia_otro:           { type: String },
  solvente:                 { type: String },
  solvente_otro:            { type: String },
  concentracion_estimada:   { type: String },
  estado_muestra:           { type: String },
  proposito:                { type: String },
  proposito_otro:           { type: String },
  incidencias:              { type: [String], default: [] },
  incidencias_otro:         { type: String },
  descripcion_incidencias:  { type: String },
  repetida_adquisicion:     { type: String },
  observaciones:            { type: String }
});

export const EdicionModel = model<IEdicion>('Edicion', EdicionSchema);
