export class UserEntity {
  constructor(
    public readonly nombre: string,
    public readonly email: string,
    public readonly id?: string,
    public readonly password?: string,
    public readonly rol?: string,
    public readonly username?: string
  ) {}
}
