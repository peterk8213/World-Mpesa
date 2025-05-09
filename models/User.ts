import { Schema, model, models } from "mongoose";
import { Wallet } from "@/models/Wallet";

const UserSchema = new Schema(
  {
    worldId: { type: String, required: true, unique: true }, // User's World ID
    name: { type: String, required: true }, // User's name from Worldcoin
    verificationLevel: { type: String }, // User's verification level
    email: { type: String, unique: false }, // User's email
    worldChainAddress: { type: String }, // User's Worldcoin address
    avatar: { type: String }, // Avatar URL
    createdAt: { type: Date, default: Date.now }, // User's creation date
    userName: { type: String, max: 30, min: 3, trim: true, default: "welcome" }, // User's username
    notifications: {
      type: Boolean,
      default: false,
    },
    isAdmin: { type: Boolean, default: false }, // Admin flag
  },
  { timestamps: true }
);

// static method to get a user by World ID
UserSchema.statics.getUserByWorldId = async function (worldId) {
  return this.findOne({ worldId });
};

// static method to add a new user

UserSchema.statics.addNewUser = async function ({
  worldId,
  name,
  email,
  verificationLevel,
}) {
  return this.create({ worldId, name, email, verificationLevel });
};

/// static method to add a username
UserSchema.statics.addUserName = async function ({
  userId,
  userName,
}: {
  userId: string;
  userName: string;
}) {
  return this.findOneAndUpdate(
    { _id: userId },
    { userName },
    { new: true, runValidators: true }
  );
};

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

/// static method to change users notifications settings
UserSchema.statics.changeNotificationSettings = async function ({
  userId,
  notifications,
}: {
  userId: string;
  notifications: boolean;
}) {
  return this.findOneAndUpdate(
    { _id: userId },
    { notifications },
    { new: true, runValidators: true }
  );
};

// Use models to check if 'User' model already exists to prevent recompilation issues

export const User = models.User || model("User", UserSchema);
