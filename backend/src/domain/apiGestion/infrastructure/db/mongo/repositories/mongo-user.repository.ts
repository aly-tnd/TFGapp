import { UserEntity } from '../../../../domain/entities/user.entity';
import { UserModel } from '../../user.schema';
import { UserRepository } from '../../../../domain/repositories/user.repository';

export class MongoUserRepository implements UserRepository {
  async save(user: UserEntity): Promise<UserEntity> {
    const created = await UserModel.create({
      name: user.nombre,
      email: user.email,
      password: user.password,
      rol: user.rol ?? 'user'
    });

    return new UserEntity(
      created.name,
      created.email,
      created._id.toString(),
      created.password,
      created.rol,
      created.username
    );
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await UserModel.find();
    return users.map(u =>
      new UserEntity(u.name, u.email, u._id.toString(), u.password, u.rol, u.username)
    );
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await UserModel.findById(id);
    if (!user) return null;
    return new UserEntity(user.name, user.email, user._id.toString(), user.password, user.rol, user.username);
  }

  async findByEmail(email: string): Promise<any> {
    return await UserModel.findOne({ email });
  }

  async borrar(id: string): Promise<void> {
    await UserModel.findByIdAndDelete(id);
  }

  async updateById(id: string, data: Partial<{ username: string; password: string }>): Promise<void> {
    await UserModel.findByIdAndUpdate(id, data);
  }
}
