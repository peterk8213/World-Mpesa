import mongoose, { Schema, Document, Model, models, model } from "mongoose";

import { MpesaPayment as MpesaPaymentType } from "@/types";

// Define TypeScript interface for Payment model
export interface IPayment extends Document {
  tracking_id: string;
  request_reference_id?: string;
  transactionAmount: number;
  status: "pending" | "completed" | "failed";
  transactionId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  paymentAccountId?: Schema.Types.ObjectId;
  phoneNumber?: string;
  currency: string;
  walletId: Schema.Types.ObjectId;
  actualCharges: number;
  estimatedCharges: number;
  ReceiverPartyPublicName?: string;
  paid_amount?: string;
  resultCode?: string;
  resultDesc?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define instance methods (methods available on model instances)
export interface IPaymentMethods {
  calculateNetProfit(): number;
}

// Define static methods (methods available on the PaymentModel itself)
export interface IPaymentStatics extends Model<IPayment, {}, IPaymentMethods> {
  createPayment(data: Partial<IPayment>): Promise<IPayment>;
  getPaymentByTransactionId(
    transactionId: string,
    userId: string
  ): Promise<IPayment | null>;
  updatePaymentStatus(
    tracking_id: string,
    status: "pending" | "completed" | "failed",
    actualCharges: number
  ): Promise<void>;
}

// Define a schema for payments
const MpesaPaymentSchema = new Schema<
  IPayment,
  IPaymentStatics,
  IPaymentMethods
>(
  {
    tracking_id: { type: String, required: true, unique: true },
    request_reference_id: { type: String },
    transactionAmount: { type: Number, required: true },
    status: {
      type: String,
      required: true,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    transactionId: {
      type: Schema.Types.ObjectId,
      ref: "Transaction",
      required: true,
      unique: true,
    },
    walletId: { type: Schema.Types.ObjectId, ref: "Wallet", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    paymentAccountId: { type: Schema.Types.ObjectId, ref: "PaymentAccount" },
    phoneNumber: { type: String },
    currency: { type: String, default: "KES" },
    actualCharges: { type: Number, default: 0 },
    estimatedCharges: { type: Number, default: 0 },
    ReceiverPartyPublicName: { type: String },
    paid_amount: { type: String },
    resultCode: { type: String },
    resultDesc: { type: String },
  },
  { timestamps: true }
);

// Instance Method to calculate net profit
MpesaPaymentSchema.method("calculateNetProfit", function () {
  return this.transactionAmount - this.actualCharges;
});

// Static method to create a payment
MpesaPaymentSchema.static(
  "createPayment",
  async function ({
    tracking_id,
    request_reference_id,
    transactionAmount,
    status,
    currency,
    estimatedCharges,
    transactionId,
    paymentAccountId,
    userId,
    walletId,
  }: MpesaPaymentType) {
    return this.create({
      tracking_id,
      request_reference_id,
      transactionAmount,
      status,
      currency,
      estimatedCharges,
      transactionId,
      paymentAccountId,
      userId,
      walletId,
    });
  }
);

// Static method to get a payment by transaction ID
MpesaPaymentSchema.static(
  "getPaymentByTransactionId",
  async function (transactionId, userId) {
    return this.findOne({ transactionId, userId });
  }
);

// Static method to update payment status
MpesaPaymentSchema.static(
  "updatePaymentStatus",
  async function (tracking_id, status, actualCharges) {
    return this.updateOne({ tracking_id }, { status, actualCharges });
  }
);

// Create and export the Payment model
const MpesaPayment =
  models.MpesaPayment ||
  model<IPayment, IPaymentStatics>("MpesaPayment", MpesaPaymentSchema);

export default MpesaPayment;
