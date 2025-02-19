import { Schema, model, models, Model, Document } from "mongoose";

interface WalletDocument extends Document {
  userId: Schema.Types.ObjectId;
  worldId: string;
  balance: number;
  currency: "KES" | "USD";
  isFrozen: boolean;
  verifyWithdrawRequest: (amount: number) => boolean;
}

interface WalletModel extends Model<WalletDocument> {
  freezeWallet: (userId: Schema.Types.ObjectId) => Promise<WalletDocument>;
  unfreezeWallet: (userId: Schema.Types.ObjectId) => Promise<WalletDocument>;
  getWalletByUserId: (
    userId: Schema.Types.ObjectId
  ) => Promise<WalletDocument | null>;
  getWalletBalanceByUserId: (
    userId: Schema.Types.ObjectId
  ) => Promise<Pick<WalletDocument, "balance" | "currency"> | null>;
  deposit: ({
    userId,
    amount,
  }: {
    userId: Schema.Types.ObjectId;
    amount: number;
  }) => Promise<WalletDocument>;
  withdraw: ({
    userId,
    amount,
  }: {
    userId: Schema.Types.ObjectId;
    amount: number;
  }) => Promise<WalletDocument>;
}

const WalletSchema = new Schema<WalletDocument, WalletModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    worldId: { type: String, required: true, unique: true },
    balance: { type: Number, required: true, default: 0, min: 0 },
    currency: { type: String, default: "USD", enum: ["KES", "USD"] },
    isFrozen: { type: Boolean, default: false },
  },
  { timestamps: true }
);

WalletSchema.methods.verifyWithdrawRequest = function (amount: number) {
  return this.balance >= amount && !this.isFrozen && amount > 1;
};

WalletSchema.statics.withdraw = async function ({ userId, amount }) {
  /// static method to find one and update the wallet balance and return the updated wallet

  const wallet = await this.findOne({ userId });
  if (!wallet) throw new Error("Wallet not found.");
  if (wallet.balance < amount) throw new Error("Insufficient funds");

  wallet.balance -= amount;
  const updatedWallet = await wallet.save();
  return updatedWallet;
};

WalletSchema.statics.deposit = async function ({ userId, amount }) {
  ///// i want to find one and update the wallet balance and return the updated wallet
  const wallet = await this.findOne({ userId });
  if (!wallet) throw new Error("Wallet not found.");
  wallet.balance += amount;
  const updatedWallet = await wallet.save();
  return updatedWallet;
};

WalletSchema.statics.getWalletByUserId = async function (userId) {
  return await this.findOne({ userId, isFrozen: false }).populate("userId");
};

WalletSchema.statics.getWalletBalanceByUserId = async function (userId) {
  return await this.findOne({ userId, isFrozen: false }).select(
    "balance currency"
  );
};

WalletSchema.statics.freezeWallet = async function (userId) {
  const wallet = await this.findOne({ userId });
  if (!wallet) throw new Error("Wallet not found.");
  wallet.isFrozen = true;
  return wallet.save();
};

WalletSchema.statics.unfreezeWallet = async function (userId) {
  const wallet = await this.findOne({ userId });
  if (!wallet) throw new Error("Wallet not found.");
  wallet.isFrozen = false;
  return wallet.save();
};

export const Wallet =
  models.Wallet || model<WalletDocument, WalletModel>("Wallet", WalletSchema);
