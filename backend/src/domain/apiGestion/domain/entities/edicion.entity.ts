export class EdicionEntity {
  constructor(
    public id:                       string,
    public registro_id:              string,
    public usuario_id:               string,
    public fecha_edicion:            Date,
    public secuencia?:               string,
    public secuencia_otro?:          string,
    public solvente?:                string,
    public solvente_otro?:           string,
    public concentracion_estimada?:  string,
    public estado_muestra?:          string,
    public proposito?:               string,
    public proposito_otro?:          string,
    public incidencias?:             string[],
    public incidencias_otro?:        string,
    public descripcion_incidencias?: string,
    public repetida_adquisicion?:    string,
    public observaciones?:           string
  ) {}
}
