import { Schema, model, models } from "mongoose";
import { Wallet } from "@/models/Wallet";

const UserSchema = new Schema(
  {
    worldId: { type: String, required: true, unique: true }, // User's World ID
    name: { type: String, required: true }, // User's name from Worldcoin
    verificationLevel: { type: String }, // User's verification level
    email: { type: String, unique: true }, // User's email
    worldChainAddress: { type: String, unique: true }, // User's Worldcoin address
    avatar: { type: String }, // Avatar URL
    createdAt: { type: Date, default: Date.now }, // User's creation date
  },
  { timestamps: true }
);

UserSchema.post("save", async function (doc) {
  try {
    await Wallet.create({
      userId: doc._id,
      worldId: doc.worldId,
    });
  } catch (error) {
    console.error("Error creating wallet:", error);
  }
});

// Use models to check if 'User' model already exists to prevent recompilation issues

export const User = models.User || model("User", UserSchema);
