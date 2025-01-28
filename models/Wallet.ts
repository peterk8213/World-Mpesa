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

    balance: { type: Number, required: true, default: 0, min: 0 }, // Wallet balance
    currency: {
      type: String,
      default: "USD",
      enum: ["KES", "USD"],
    }, // Default currency

    isFrozen: { type: Boolean, default: false }, // Indicates if the wallet is frozen
  },
  { timestamps: true } // Automatically handle createdAt and updatedAt fields
);

// static  method to withdraw funds
WalletSchema.statics.withdraw = async function ({ userId, amount }) {
  try {
    const wallet = await this.findOne({ userId });
    if (!wallet) {
      throw new Error("Wallet not found.");
    }
    if (wallet.balance < amount) {
      throw new Error("Insufficient funds.");
    }
    wallet.balance -= amount;
    return wallet.save();
  } catch (error) {
    console.error("Error withdrawing funds:", error);
  }
};

/// static method to deposit funds
WalletSchema.statics.deposit = async function ({ userId, amount }) {
  try {
    const wallet = await this.findOne({ userId });
    if (!wallet) {
      throw new Error("Wallet not found.");
    }
    wallet.balance += amount;
    return wallet.save();
  } catch (error) {
    console.error("Error depositing funds:", error);
  }
};

// static method to get wallet by user ID
WalletSchema.statics.getWalletByUserId = async function (userId) {
  return this.findOne({ userId, isFrozen: false });
};

//static method to freeze wallet
WalletSchema.statics.freezeWallet = async function (userId) {
  try {
    const wallet = await this.findOne({ userId });
    if (!wallet) {
      throw new Error("Wallet not found.");
    }
    wallet.isFrozen = true;
    return wallet.save();
  } catch (error) {
    console.error("Error freezing wallet:", error);
  }
};

export const Wallet = models.Wallet || model("Wallet", WalletSchema);
