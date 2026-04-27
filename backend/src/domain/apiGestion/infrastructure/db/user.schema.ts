import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Para que no haya emails repetidos
  password: { type: String, required: true },            // <-- NUEVO
  rol: { type: String, enum: ['admin', 'user'], default: 'user' } // <-- NUEVO
});

export const UserModel = mongoose.model("User", UserSchema);