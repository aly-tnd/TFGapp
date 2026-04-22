export class UserEntity {
  constructor(
    public readonly nombre: string,
    public readonly email: string,
    public readonly id?: string
  ) {}
}