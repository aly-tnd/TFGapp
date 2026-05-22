import mongoose, { Schema, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * Seed de DEMOSTRACIÓN.
 * Rellena la base de datos con usuarios, registros y ediciones de ejemplo
 * para poder ver la aplicación con contenido.
 *
 * Es idempotente: se puede ejecutar varias veces. Para los usuarios de demo
 * (los del dominio @labrmn.es) borra sus registros y ediciones antes de
 * volver a crearlos, así no se duplican. No toca a otros usuarios.
 *
 * Ejecutar:
 *   npm run seed:demo
 *   (o)  ts-node src/seed-demo.ts
 *   (o, ya compilado)  node dist/seed-demo.js
 *
 * Usa la variable de entorno MONGO_URI (local de Docker o de MongoDB Atlas).
 */

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mi_proyecto_db';
const DEMO_PASSWORD = process.env.DEMO_PASSWORD || 'Demo1234';

// ---- Esquemas mínimos con los MISMOS nombres de modelo que la app ----
// (mismos nombres => mismas colecciones que usa la aplicación)
const UserSchema = new Schema({
  username: { type: String },
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol:      { type: String, enum: ['admin', 'user'], default: 'user' },
});
const RegistroSchema = new Schema({
  solicitud_id:     { type: Number },
  espectrometro:    { type: String, required: true },
  espectrometro_id: { type: Schema.Types.ObjectId, ref: 'Espectrometro' },
  sonda:            { type: String, required: true },
  usuario_id:       { type: String, required: true },
  fecha_entrada:    { type: Date, default: Date.now },
  muestra:          { type: String, required: true },
  completo:         { type: Boolean, default: false },
});
const EdicionSchema = new Schema({
  registro_id:             { type: Schema.Types.ObjectId, ref: 'Registro', required: true },
  usuario_id:              { type: String, required: true },
  fecha_edicion:           { type: Date, default: Date.now },
  secuencia:               { type: String },
  solvente:                { type: String },
  concentracion_estimada:  { type: String },
  estado_muestra:          { type: String },
  proposito:               { type: String },
  incidencias:             { type: [String], default: [] },
  repetida_adquisicion:    { type: String },
  observaciones:           { type: String },
});
const EspectrometroSchema = new Schema({
  nombre: { type: String, required: true, unique: true },
  sondas: [{ type: String }],
});

const UserModel          = mongoose.model('User', UserSchema);
const RegistroModel      = mongoose.model('Registro', RegistroSchema);
const EdicionModel       = mongoose.model('Edicion', EdicionSchema);
const EspectrometroModel = mongoose.model('Espectrometro', EspectrometroSchema);

// ---- Generación de los datos (sin tocar la base de datos) ----
function buildSeed() {
  const espectrometros = [
    { nombre: 'Bruker Avance NEO 400 (Muestras Liquidas)', sondas: ['PI HR BB400 (5mm)', 'PA BBI400 S1 (5mm)', 'PA BBI400 DIFF (5mm)'] },
    { nombre: 'Bruker Avance III 500 (Muestras Liquidas)', sondas: ['PABBI (5mm)', 'PASEX (10mm)'] },
    { nombre: 'Bruker Avance NEO HD 400 (Muestras Solidas)', sondas: ['SPRB400172_7164 (7.5 mm)', 'SPRB400172_7423 (7.5 mm)', 'H8906-20_007 (Triple resonancia)', 'H13664_0016 (2.5 mm)', 'H12138_0076 (Doble Resonancia)', 'H13349_0014 (Baja Frecuencia)'] },
  ];

  const users = [
    { name: 'Laura Martín',             email: 'laura.martin@labrmn.es',     username: 'lmartin',    rol: 'admin' },
    { name: 'Administrador del Sistema', email: 'admin@labrmn.es',           username: 'admin',      rol: 'admin' },
    { name: 'Aly Tandia',               email: 'aly.tandia@labrmn.es',       username: 'atandia',    rol: 'user' },
    { name: 'Vidal Torres',             email: 'vidal.torres@labrmn.es',     username: 'vtorres',    rol: 'user' },
    { name: 'Alejandro Plaza',          email: 'alejandro.plaza@labrmn.es',  username: 'aplaza',     rol: 'user' },
    { name: 'Lucía Fernández',          email: 'lucia.fernandez@labrmn.es',  username: 'lfernandez', rol: 'user' },
  ];

  const muestras = ['Aspirina recristalizada', 'Ácido benzoico', 'Cafeína (extracto de té)', 'Compuesto AT-12', 'Polímero PLA', 'Ligando L4', 'Catalizador Pd-NHC', 'Fármaco F-205', 'Aceite esencial de lavanda', 'Resina epoxi curada', 'Péptido P7', 'Glucosa marcada 13C', 'Disolución tampón fosfato', 'Membrana de celulosa', 'Ibuprofeno sódico', 'Complejo Cu-salen'];

  const normalUserIdx = [2, 3, 4, 5];
  const perUser: Record<number, number> = { 2: 8, 3: 8, 4: 7, 5: 7 };

  const registros: any[] = [];
  let mi = 0;
  for (const uIdx of normalUserIdx) {
    const k = perUser[uIdx];
    for (let i = 0; i < k; i++) {
      const espIdx = (uIdx + i) % 3;
      const sondaIdx = i % espectrometros[espIdx].sondas.length;
      const muestra = muestras[mi % muestras.length] + ' (lote ' + (100 + mi) + ')'; mi++;
      const daysAgo = (k - i) * 9 + uIdx * 3;
      const fecha = new Date(2026, 4, 22); fecha.setDate(fecha.getDate() - daysAgo);
      const completo = i < k - 2;
      registros.push({ userIdx: uIdx, espIdx, sondaIdx, muestra, fecha_entrada: fecha, completo, solicitud_id: i + 1 });
    }
  }

  const secuencias = ['1H', '13C', 'DEPT-135', 'COSY', 'HSQC', 'HMBC', '31P', '19F'];
  const solventes = ['CDCl3', 'DMSO-d6', 'D2O', 'MeOD', 'Acetona-d6', 'C6D6'];
  const estados = ['Líquida', 'Sólida', 'Disuelta'];
  const propositos = ['Identificación estructural', 'Control de pureza', 'Cuantificación', 'Seguimiento de reacción'];
  const incidenciasPool = [[], ['Señal de disolvente intensa'], ['Baja relación señal-ruido'], ['Muestra poco soluble'], ['Tubo de RMN defectuoso', 'Repetir adquisición']];
  const concentraciones = ['5 mg/mL', '10 mg/mL', '20 mg/mL', '15 mg/0,6 mL', 'saturada'];
  const obs = ['Espectro limpio, asignación completa.', 'Se observan trazas de disolvente residual.', 'Buena resolución; picos bien definidos.', 'Conviene repetir con mayor número de scans.', 'Muestra estable durante la adquisición.'];

  const ediciones: any[] = [];
  let count = 0;
  for (let r = 0; r < registros.length && count < 15; r += 2) {
    const reg = registros[r];
    ediciones.push({
      regIdx: r,
      ownerUserIdx: reg.userIdx,
      secuencia: secuencias[count % secuencias.length],
      solvente: solventes[count % solventes.length],
      concentracion_estimada: concentraciones[count % concentraciones.length],
      estado_muestra: estados[count % estados.length],
      proposito: propositos[count % propositos.length],
      incidencias: incidenciasPool[count % incidenciasPool.length],
      observaciones: obs[count % obs.length],
      repetida_adquisicion: (count % 4 === 0) ? 'Sí' : 'No',
      fecha_edicion: new Date(reg.fecha_entrada.getTime() + (2 + count % 5) * 86400000),
    });
    count++;
  }

  return { espectrometros, users, registros, ediciones };
}

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Conectado a MongoDB\n');

  const data = buildSeed();
  const hash = await bcrypt.hash(DEMO_PASSWORD, 10);

  // 1) Espectrómetros (upsert por nombre)
  for (const esp of data.espectrometros) {
    await EspectrometroModel.updateOne(
      { nombre: esp.nombre },
      { $setOnInsert: { nombre: esp.nombre, sondas: esp.sondas } },
      { upsert: true }
    );
  }
  const espDocs = await EspectrometroModel.find().lean();
  const espIdByNombre: Record<string, Types.ObjectId> = {};
  espDocs.forEach((e: any) => { espIdByNombre[e.nombre] = e._id; });
  console.log(`Espectrómetros listos: ${espDocs.length}`);

  // 2) Usuarios (upsert por email; contraseña de demo conocida y hasheada)
  const userIdByIdx: string[] = [];
  for (const u of data.users) {
    await UserModel.updateOne(
      { email: u.email },
      { $set: { name: u.name, username: u.username, rol: u.rol, password: hash } },
      { upsert: true }
    );
    const doc: any = await UserModel.findOne({ email: u.email }).lean();
    userIdByIdx.push(doc._id.toString());
  }
  const demoUserIds = userIdByIdx.slice();
  console.log(`Usuarios de demo listos: ${data.users.length}`);

  // 3) Limpiar datos previos SOLO de los usuarios de demo (idempotencia)
  const prevRegs = await RegistroModel.find({ usuario_id: { $in: demoUserIds } }, { _id: 1 }).lean();
  const prevRegIds = prevRegs.map((r: any) => r._id);
  await EdicionModel.deleteMany({ $or: [{ usuario_id: { $in: demoUserIds } }, { registro_id: { $in: prevRegIds } }] });
  await RegistroModel.deleteMany({ usuario_id: { $in: demoUserIds } });

  // 4) Registros
  const regDocsToInsert = data.registros.map((r) => ({
    solicitud_id: r.solicitud_id,
    espectrometro: data.espectrometros[r.espIdx].nombre,
    espectrometro_id: espIdByNombre[data.espectrometros[r.espIdx].nombre],
    sonda: data.espectrometros[r.espIdx].sondas[r.sondaIdx],
    usuario_id: userIdByIdx[r.userIdx],
    fecha_entrada: r.fecha_entrada,
    muestra: r.muestra,
    completo: r.completo,
  }));
  const insertedRegs = await RegistroModel.insertMany(regDocsToInsert);
  console.log(`Registros creados: ${insertedRegs.length}`);

  // 5) Ediciones (referencian a los registros recién creados)
  const edDocsToInsert = data.ediciones.map((ed) => ({
    registro_id: insertedRegs[ed.regIdx]._id,
    usuario_id: userIdByIdx[ed.ownerUserIdx],
    fecha_edicion: ed.fecha_edicion,
    secuencia: ed.secuencia,
    solvente: ed.solvente,
    concentracion_estimada: ed.concentracion_estimada,
    estado_muestra: ed.estado_muestra,
    proposito: ed.proposito,
    incidencias: ed.incidencias,
    repetida_adquisicion: ed.repetida_adquisicion,
    observaciones: ed.observaciones,
  }));
  const insertedEd = await EdicionModel.insertMany(edDocsToInsert);
  console.log(`Ediciones creadas: ${insertedEd.length}`);

  console.log('\n--- Credenciales de acceso (todas con la misma contraseña) ---');
  console.log(`Contraseña: ${DEMO_PASSWORD}`);
  data.users.forEach((u) => console.log(`  [${u.rol}] ${u.email}`));

  await mongoose.disconnect();
  console.log('\nSeed de demostración completado.');
}

seed().catch((err) => {
  console.error('Error en seed-demo:', err.message);
  process.exit(1);
});
