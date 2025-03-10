import { Schema, model, models, Document, Model } from "mongoose";

// Define TypeScript interface for Transactions
export interface ITransaction extends Document {
  userId: Schema.Types.ObjectId;
  walletId: Schema.Types.ObjectId;
  worldId: string;
  amount: number;
  method: "worldcoin" | "mpesa";
  type: "credit" | "debit";
  status: "pending" | "submitted" | "completed" | "failed";
  description?: string;
  reference: string;
  meta?: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

// Define static methods interface
export interface ITransactionStatics extends Model<ITransaction> {
  createMpesaTransaction(data: Partial<ITransaction>): Promise<ITransaction>;
  createWorldcoinTransaction(
    data: Partial<ITransaction>
  ): Promise<ITransaction>;
  updateTransactionStatus(
    reference: string,
    status: string
  ): Promise<ITransaction | null>;
}

// Define Transaction Schema
const TransactionSchema = new Schema<ITransaction, ITransactionStatics>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    walletId: { type: Schema.Types.ObjectId, ref: "Wallet", required: true },
    worldId: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    method: { type: String, enum: ["worldcoin", "mpesa"], required: true },
    type: { type: String, enum: ["credit", "debit", "send"], required: true },
    status: {
      type: String,
      enum: ["pending", "submitted", "completed", "failed"],
      default: "pending",
    },
    description: { type: String },
    reference: { type: String, unique: true },
    meta: { type: Map, of: String },
  },
  { timestamps: true }
);

// Generate a unique transaction reference before saving
TransactionSchema.pre("validate", function (next) {
  if (!this.reference) {
    this.reference = `txn_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 8)}`;
  }
  next();
});

// Static method to create an M-Pesa transaction
TransactionSchema.statics.createMpesaTransaction = async function ({
  userId,
  walletId,
  worldId,
  amount,
  reference,
}: Partial<ITransaction>) {
  if (amount === undefined || amount < 1) {
    throw new Error("Amount must be greater than 1");
  }
  const mpesaPayout = await this.create({
    userId,
    walletId,
    worldId,
    amount,
    reference,
    method: "mpesa",
    type: "debit",
    status: "pending",
    description: "Mpesa debit transaction",
    meta: {},
  });

  return mpesaPayout;
};

// Static method to create a Worldcoin transaction
TransactionSchema.statics.createWorldcoinTransaction = async function ({
  userId,
  walletId,
  worldId,
  amount,
  reference,
  meta = {},
}: Partial<ITransaction>) {
  if (amount === undefined || amount < 0.1) {
    throw new Error("Amount must be atleast 0.1");
  }
  return this.create({
    userId,
    walletId,
    worldId,
    amount,
    reference,
    meta,
    method: "worldcoin",
    type: "credit",
    status: "pending",
    description: "Worldcoin deposit transaction",
  });
};

// Static method to update transaction status
TransactionSchema.statics.updateTransactionStatus = async function (
  reference: string,
  status: "pending" | "submitted" | "completed" | "failed"
) {
  return this.findOneAndUpdate({ reference }, { status }, { new: true });
};

export const Transaction =
  models.Transaction ||
  model<ITransaction, ITransactionStatics>("Transaction", TransactionSchema);
