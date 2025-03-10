import { Schema, model, Document, models } from "mongoose";

// Interface for the Worldcoin Transaction Document
interface IWorldcoinTransaction extends Document {
  transactionStatus: string; // e.g., "submitted"
  transaction_id: string; // Unique ID from Worldcoin
  transactionHash: string | null; // Transaction hash from Worldcoin
  receipientAddress: string; // Wallet address receiving the transaction
  fromWalletAddress: string; // Wallet address initiating the transaction
  reference: string; // Reference ID for your tracking
  miniappId: string; // Reference to your internal transaction
  updatedAt: string; // Date of last update
  network: string; // Blockchain network used
  inputToken: string; // Token used for the transaction
  inputTokenAmount: number; // Amount of token sent
  version: number; // API or transaction version
  transactionId?: Schema.Types.ObjectId; // Reference to your internal transaction
  userId: Schema.Types.ObjectId; // Reference to the User model
  walletId: Schema.Types.ObjectId; // Reference to the Wallet model
}

// Mongoose Schema
const WldTransactionSchema = new Schema<IWorldcoinTransaction>(
  {
    transactionStatus: { type: String, required: true },
    transactionHash: { type: String },
    transaction_id: { type: String, unique: true, required: true },
    reference: { type: String, required: true },
    fromWalletAddress: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    miniappId: { type: String, required: true },
    updatedAt: { type: String, required: true },

    inputToken: { type: String },
    inputTokenAmount: { type: Number },
    receipientAddress: { type: String },

    network: { type: String },

    version: { type: Number },
    transactionId: { type: Schema.Types.ObjectId, ref: "Transaction" }, // Reference to your Transaction model
  },
  { timestamps: true }
);

// static method to create a Worldcoin transaction

WldTransactionSchema.statics.createTransaction = async function ({
  transactionStatus,
  transaction_id,
  transactionId,
  transactionHash,
  receipientAddress,
  fromWalletAddress,
  reference,
  miniappId,
  userId,
  walletId,
  inputToken,
  inputTokenAmount,
  network,
  updatedAt,
}: Partial<IWorldcoinTransaction>) {
  return this.create({
    transactionStatus,
    transaction_id,
    transactionHash,
    transactionId,
    receipientAddress,
    fromWalletAddress,
    reference,
    miniappId,
    userId,
    walletId,
    inputToken,
    inputTokenAmount,
    network,
    updatedAt,
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
