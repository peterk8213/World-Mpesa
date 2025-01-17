import { Schema, model, models } from "mongoose";

const WalletSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    }, // Reference to the User model
    worldId: { type: String, required: true, unique: true }, // User's World ID

    balance: { type: Number, required: true, default: 0 }, // Wallet balance
    currency: {
      type: String,
      default: "USD",
      enum: ["KES", "USD"],
    }, // Default currency

    isFrozen: { type: Boolean, default: false }, // Indicates if the wallet is frozen
  },
  { timestamps: true } // Automatically handle createdAt and updatedAt fields
);

// Middleware to validate balance on withdrawals
WalletSchema.methods.withdraw = async function (amount: number) {
  if (this.isFrozen) {
    throw new Error("Wallet is frozen. Cannot perform transactions.");
  }
  if (this.balance < amount) {
    throw new Error("Insufficient funds.");
  }
  this.balance -= amount;
  return this.save();
};

// Method to deposit funds
WalletSchema.methods.deposit = async function (amount: number) {
  if (this.isFrozen) {
    throw new Error("Wallet is frozen. Cannot perform transactions.");
  }
  this.balance += amount;
  return this.save();
};

export const Wallet = models.Wallet || model("Wallet", WalletSchema);
