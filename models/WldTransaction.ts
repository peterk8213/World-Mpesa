import { Schema, model, Document, models } from "mongoose";

// Interface for the Worldcoin Transaction Document
interface IWorldcoinTransaction extends Document {
  status: string; // Typically "success"
  transaction_status: string; // e.g., "submitted"
  transaction_id: string; // Unique ID from Worldcoin
  reference: string; // Reference ID for your tracking
  from: string; // Wallet address initiating the transaction
  chain: string; // Blockchain network used
  timestamp: Date; // When the transaction was submitted
  version: number; // API or transaction version
  transactionId?: Schema.Types.ObjectId; // Reference to your internal transaction
  userId: Schema.Types.ObjectId; // Reference to the User model
  walletId: Schema.Types.ObjectId; // Reference to the Wallet model
}

// Mongoose Schema
const WldTransactionSchema = new Schema<IWorldcoinTransaction>({
  status: { type: String, required: true },
  transaction_status: { type: String, required: true },
  transaction_id: { type: String, unique: true, required: true },
  reference: { type: String, required: true },
  from: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  walletId: { type: Schema.Types.ObjectId, ref: "Wallet", required: true }, // Reference to the Wallet model

  chain: { type: String },
  timestamp: { type: Date, required: true },
  version: { type: Number },
  transactionId: { type: Schema.Types.ObjectId, ref: "Transaction" }, // Reference to your Transaction model
});

// static method to create a Worldcoin transaction

WldTransactionSchema.statics.createTransaction = async function ({
  status,
  transaction_status,
  transaction_id,
  reference,
  from,
  userId,
  walletId,
  chain,
  timestamp,
  version,
  transactionId,
}) {
  return this.create({
    status,
    transaction_status,
    transaction_id,
    reference,
    from,
    userId,
    walletId,
    chain,
    timestamp,
    version,
    transactionId,
  });
};

// static method to get a Worldcoin transaction by ID and user ID
WldTransactionSchema.statics.getTransactionByTransactionId = async function (
  transactionId,
  userId
) {
  return this.findOne({ transactionId, userId });
};

// Mongoose Model
export const WorldcoinTransaction =
  models.WorldcoinTransaction ||
  model<IWorldcoinTransaction>("WorldcoinTransaction", WldTransactionSchema);
