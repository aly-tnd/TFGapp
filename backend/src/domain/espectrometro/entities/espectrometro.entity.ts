export class EspectrometroEntity {
  constructor(
    public id: string | null,
    public nombre: string,
    public sondas: string[]
  ) {}
}