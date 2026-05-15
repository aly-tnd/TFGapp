import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mi_proyecto_db';

// ── Schemas mínimos para el seed (sin importar toda la app) ──────────────────

const UserSchema = new mongoose.Schema({
  username: { type: String },
  name:     { type: String },
  email:    { type: String },
  password: { type: String },
  rol:      { type: String, default: 'user' }
}, { strict: false });

const EspectrometroSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  sondas: [{ type: String }]
});

const UserModel          = mongoose.model('User', UserSchema);
const EspectrometroModel = mongoose.model('Espectrometro', EspectrometroSchema);

// ── Datos de espectrometros a insertar ───────────────────────────────────────

const ESPECTROMETROS = [
  {
    nombre: 'Bruker Avance NEO 400 (Muestras Líquidas)',
    sondas: [
      'PI HR BB400 (5mm)',
      'PA BBI400 S1 (5mm)',
      'PA BBI400 DIFF (5mm)'
    ]
  },
  {
    nombre: 'Bruker Avance III 500 (Muestras Líquidas)',
    sondas: [
      'PABBI (5mm)',
      'PASEX (10mm)'
    ]
  },
  {
    nombre: 'Bruker Avance NEO HD 400 (Muestras Sólidas)',
    sondas: [
      'SPRB400172_7164 (7.5 mm)',
      'SPRB400172_7423 (7.5 mm)',
      'H8906-20_007 (Triple resonancia)',
      'H13664_0016 (2.5 mm)',
      'H12138_0076 (Doble Resonancia)',
      'H13349_0014 (Baja Frecuencia)'
    ]
  }
];

// ── Seed ─────────────────────────────────────────────────────────────────────

async function seedUsuarios() {
  const users = await UserModel.find();

  if (users.length === 0) {
    console.log('⚠️  No hay usuarios. Créalos con POST /api/usuarios.');
    return;
  }

  for (const user of users) {
    const pwd = (user as any).password as string | undefined;
    const isBcrypt = pwd?.startsWith('$2b$') || pwd?.startsWith('$2a$');
    if (!isBcrypt && pwd) {
      const hashed = await bcrypt.hash(pwd, 10);
      await UserModel.updateOne({ _id: user._id }, { $set: { password: hashed } });
      console.log(`  ✅ Contraseña hasheada: ${(user as any).email}`);
    } else {
      console.log(`  ℹ️  Hash OK: ${(user as any).email}`);
    }
  }
}

async function seedEspectrometros() {
  let creados = 0;
  let existentes = 0;

  for (const esp of ESPECTROMETROS) {
    const resultado = await EspectrometroModel.updateOne(
      { nombre: esp.nombre },
      { $setOnInsert: { nombre: esp.nombre, sondas: esp.sondas } },
      { upsert: true }
    );
    if (resultado.upsertedCount > 0) {
      console.log(`  ✅ Creado: ${esp.nombre} (${esp.sondas.length} sondas)`);
      creados++;
    } else {
      console.log(`  ℹ️  Ya existe: ${esp.nombre}`);
      existentes++;
    }
  }

  console.log(`  → ${creados} creados, ${existentes} ya existían`);
}

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Conectado a MongoDB\n');

  console.log('── Usuarios ─────────────────────────────');
  await seedUsuarios();

  console.log('\n── Espectrometros ───────────────────────');
  await seedEspectrometros();

  await mongoose.disconnect();
  console.log('\n✅ Seed completado.');
}

seed().catch(err => {
  console.error('❌ Error en seed:', err.message);
  process.exit(1);
});
