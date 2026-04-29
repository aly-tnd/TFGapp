import { UserEntity } from "../../../../domain/entities/user.entity";
import { UserModel } from "../../user.schema";
import { UserRepository } from "./user.repository";

export class MongoUserRepository implements UserRepository {
  
  async save(user: UserEntity): Promise<UserEntity> {
    const created = await UserModel.create({
      name: user.nombre,
      email: user.email,
      password: user.password,
      rol: user.rol
    });

    return new UserEntity(
      created.name as string, 
      created.email as string, 
      created._id.toString()
    );
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await UserModel.find();

    return users.map(user => new UserEntity(
      user.name as string,
      user.email as string,
      user._id.toString()
    ));
  }


  async findById(id: string): Promise<UserEntity | null> {
    const user = await UserModel.findById(id);
    if (!user) return null;
    
    return new UserEntity(
      user.name as string, 
      user.email as string, 
      user._id.toString()
    );
  }

  async borrar(id: string): Promise<void> {
    await UserModel.findByIdAndDelete(id);
  }

  async findByEmail(email: string): Promise<any> {
  return await UserModel.findOne({ email }).lean();
}
}