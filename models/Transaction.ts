import { Schema, model, models } from "mongoose";

const TransactionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference
    // to the User model
    walletId: { type: Schema.Types.ObjectId, ref: "Wallet", required: true }, // Reference to the Wallet model
    worldId: { type: String, required: true }, // User's World ID

    amount: { type: Number, required: true, min: 0.2 }, // Amount involved in the transaction, minimum value of 0.01
    method: {
      type: String,
      enum: ["worldcoin", "mpesa"],
      required: true,
    }, // Transaction method
    type: {
      type: String,
      enum: ["credit", "debit"], // Credit for deposits, debit for withdrawals
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "submitted", "completed", "failed"],
      default: "pending",
    }, // Transaction status
    description: { type: String }, // Optional description of the transaction
    reference: { type: String, unique: true }, // Unique reference for the transaction
    meta: {
      type: Map,
      of: String, // Additional metadata for flexibility (e.g., payment processor details)
    },
    createdAt: { type: Date, default: Date.now }, // Timestamp for transaction creation
  },
  { timestamps: true } // Automatically handles createdAt and updatedAt fields
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

// Static method to create a transaction
TransactionSchema.statics.createMpesaTransaction = async function ({
  userId,
  walletId,
  worldId,
  amount,
  reference,
}: ) {
  if (amount <= 0.15) {
    throw new Error("Amount must be greater than 0.15.");
  }
  const transaction = new this({
    userId,
    walletId,
    worldId,
    amount,
    reference,
    meta: {},
    method: "mpesa",
    type: "debit",
    status: "pending",
    description: "Mpesa debit transaction",
  });
  return transaction.save();
};

// Static method to create a Worldcoin transaction
TransactionSchema.statics.createWorldcoinTransaction = async function ({
  userId,
  walletId,
  worldId,
  amount,
  reference,
  meta,
}:{

  userId: string;

  walletId: string;

  worldId: string;

  amount: number;

  reference: string;

  meta: any;

}) {
  if (amount <= 0.15) {
    throw new Error("Amount must be greater than 0.15");
  }
  const transaction = new this({
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
  return transaction.save();
};

// static method to update transaction status
TransactionSchema.statics.updateTransactionStatus = async function (
  reference: string,
  status: string
) {
  if (!["pending", "submitted", "completed", "failed"].includes(status)) {
    throw new Error("Invalid status.");
  }
  return this.findOneAndUpdate({ reference }, { status });
};

export const Transaction =
  models.Transaction || model("Transaction", TransactionSchema);
