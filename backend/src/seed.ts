import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mi_proyecto_db';

const UserSchema = new mongoose.Schema({
  username: { type: String },
  name: { type: String },
  email: { type: String },
  password: { type: String },
  rol: { type: String, default: 'user' }
}, { strict: false });

const UserModel = mongoose.model('User', UserSchema);

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Conectado a MongoDB');

  const users = await UserModel.find();

  if (users.length === 0) {
    console.log('⚠️  No hay usuarios en la base de datos.');
    console.log('   Crea un admin con: POST /api/usuarios { name, email, password, rol: "admin" }');
  }

  for (const user of users) {
    const pwd = (user as any).password as string | undefined;
    const isBcrypt = pwd?.startsWith('$2b$') || pwd?.startsWith('$2a$');

    if (!isBcrypt && pwd) {
      const hashed = await bcrypt.hash(pwd, 10);
      await UserModel.updateOne({ _id: user._id }, { $set: { password: hashed } });
      console.log(`✅ Contraseña hasheada para: ${(user as any).email}`);
    } else {
      console.log(`ℹ️  Ya tiene hash: ${(user as any).email}`);
    }
  }

  await mongoose.disconnect();
  console.log('✅ Seed completado. Ya puedes iniciar sesión.');
}

seed().catch(err => {
  console.error('❌ Error en seed:', err.message);
  process.exit(1);
});
