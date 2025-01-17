import { Schema, model, models } from "mongoose";

const TransactionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference
    // to the User model
    walletId: { type: Schema.Types.ObjectId, ref: "Wallet", required: true }, // Reference to the Wallet model
    worldId: { type: String, required: true, unique: true }, // User's World ID

    paymentAccountId: {
      type: Schema.Types.ObjectId,
      ref: "PaymentAccount",
    },
    amount: { type: Number, required: true, min: 0.01 }, // Amount involved in the transaction, minimum value of 0.01
    type: {
      type: String,
      enum: ["deposit", "withdraw"], // Allowed transaction types
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "canceled"], // Transaction status
      default: "pending",
    },
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
TransactionSchema.statics.createTransaction = async function ({
  userId,
  walletId,
  amount,
  type,
  description = "",
  meta = {},
}) {
  if (amount <= 0) {
    throw new Error("Amount must be greater than zero.");
  }
  const transaction = new this({
    userId,
    walletId,
    amount,
    type,
    description,
    meta,
  });
  return transaction.save();
};

// Instance method to update the status of a transaction
TransactionSchema.methods.updateStatus = async function (status: string) {
  if (!["pending", "completed", "failed", "canceled"].includes(status)) {
    throw new Error("Invalid status.");
  }
  this.status = status;
  return this.save();
};

export const Transaction =
  models.Transaction || model("Transaction", TransactionSchema);
