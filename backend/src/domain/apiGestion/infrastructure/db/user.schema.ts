import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  // ELIMINAMOS la línea del _id: { type: String, required: true }
  name: { type: String, required: true },
  email: { type: String, required: true },
});

export const UserModel = mongoose.model("User", UserSchema);