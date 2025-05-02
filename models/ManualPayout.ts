import mongoose, { Schema, Document, Model, models, model } from "mongoose";

export interface IManualPayout extends Document {
  phoneNumber: string;
  currency: string;
  status: "pending" | "completed" | "failed";
  fees?: number; // Optional field for fees
  processedBy?: Schema.Types.ObjectId; // Admin or system user
  amountinKes: number; // Amount in KES
  amountinUsd: number; // Amount in USD
  actualCharges?: number;
  userId: Schema.Types.ObjectId; // Optionally track who the payout was for
  confirmationCode?: string; // M-Pesa code if completed
  notes?: string;
  transactionId: Schema.Types.ObjectId;
  ReceiverPartyPublicName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ManualPayoutSchema = new Schema<IManualPayout>(
  {
    transactionId: {
      type: Schema.Types.ObjectId,
      ref: "Transaction",
      required: true,
      unique: true,
    },
    actualCharges: { type: Number, default: 0 },
    phoneNumber: { type: String, required: true },
    amountinKes: { type: Number, required: true },
    amountinUsd: { type: Number, required: true },
    currency: { type: String, default: "KES" },
    fees: { type: Number, default: 0 },
    status: {
      type: String,
      required: true,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    processedBy: { type: Schema.Types.ObjectId, ref: "User" },
    ReceiverPartyPublicName: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    confirmationCode: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

const ManualPayout =
  models.ManualPayout ||
  model<IManualPayout>("ManualPayout", ManualPayoutSchema);

export default ManualPayout;
