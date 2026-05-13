import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  username: { type: String },                                        // Nombre visible del usuario (opcional)
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: { type: String, enum: ['admin', 'user'], default: 'user' }
});

export const UserModel = mongoose.model("User", UserSchema);