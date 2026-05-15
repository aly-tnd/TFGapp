export class RegistroEntity {
  constructor(
    public id: string,
    public espectrometro: string,
    public sonda: string,
    public usuario_id: string,
    public fecha_entrada: Date,
    public muestra: string,
    public completo: boolean,
    public espectrometro_id?: string
  ) {}
}
