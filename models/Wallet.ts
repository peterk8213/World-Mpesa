import { Schema, model, models, Model } from "mongoose";

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
WalletSchema.statics.withdraw = async function ({
  userId,
  amount,
}: {
  userId: string;
  amount: number;
}) {
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
WalletSchema.statics.deposit = async function ({
  userId,
  amount,
}: {
  userId: string;
  amount: number;
}) {
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
WalletSchema.statics.getWalletByUserId = async function (userId: string) {
  return this.findOne({ userId, isFrozen: false }).populate("userId");
};

// method for verifying a withdraw request takes in  amount and checks if its supposed to happer not a static method
WalletSchema.methods.verifyWithdrawRequest = function (amount: number) {
  if (this.balance < amount) {
    return false;
  }
  if (this.balance >= amount) {
    return true;
  }
};

// static method to get userBalance  by user ID
WalletSchema.statics.getWalletBalanceByUserId = async function (
  userId: string
) {
  return this.findOne({ userId, isFrozen: false }).select("balance currency ");
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

//// i want to define the stastic methods type so that errors like it does not exist in type wallet to disapper  i will start with freeze wallet

// Static method to unfreeze wallet
WalletSchema.statics.unfreezeWallet = async function (userId: string) {
  try {
    const wallet = await this.findOne({ userId });
    if (!wallet) {
      throw new Error("Wallet not found.");
    }
    wallet.isFrozen = false;
    return wallet.save();
  } catch (error) {
    console.error("Error unfreezing wallet:", error);
    throw error;
  }
};

interface WalletModel extends Document {
  userId: string;
  worldId: string;
  balance: number;
  currency: string;
  isFrozen: boolean;
}

interface WalletModelStatic extends Model<WalletModel> {
  freezeWallet: (userId: string) => Promise<WalletModel>;
  unfreezeWallet: (userId: string) => Promise<WalletModel>;
  getWalletByUserId: (userId: string) => Promise<WalletModel>;
  getWalletBalanceByUserId: (userId: string) => Promise<WalletModel>;
  deposit: (userId: string, amount: number) => Promise<WalletModel>;
  withdraw: (userId: string, amount: number) => Promise<WalletModel>;
}

// export the model

export const Wallet =
  models.Wallet ||
  model<WalletModel, WalletModelStatic>("Wallet", WalletSchema);
