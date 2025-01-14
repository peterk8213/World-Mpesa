import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  worldId: { type: String, required: true, unique: true }, // User's World ID
  name: { type: String, required: true }, // User's name from Worldcoin
  avatar: { type: String }, // Avatar URL
  phoneNumber: { type: String, required: true }, // M-Pesa phone number
  balance: { type: Number, default: 0 }, // Wallet balance
  createdAt: { type: Date, default: Date.now },
});

export const User = model("User", UserSchema);
