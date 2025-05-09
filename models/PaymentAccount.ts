import mongoose, { Schema, model, models, Document, Model } from "mongoose";
import { Provider } from "./provider";

// Define TypeScript interface for PaymentAccount
export interface IPaymentAccount extends Document {
  userId: Schema.Types.ObjectId;
  fullName: string;
  phoneNumber: string;
  walletId: Schema.Types.ObjectId;
  providerId: Schema.Types.ObjectId;

  isdefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Define static methods
export interface IPaymentAccountStatics
  extends Model<IPaymentAccount, {}, IPaymentAccountMethods> {
  addPaymentAccount(data: {
    userId: Schema.Types.ObjectId;
    fullName: string;
    phoneNumber: string;
    walletId: Schema.Types.ObjectId;
    providerId: Schema.Types.ObjectId;
    isdefault?: boolean;
  }): Promise<IPaymentAccount>;
  getPaymentAccountById(
    accountId: string,
    userId: Schema.Types.ObjectId
  ): Promise<IPaymentAccount | null>;
  getPaymentAccountsByUserId(
    userId: Schema.Types.ObjectId
  ): Promise<IPaymentAccount[]>;
}

// Define instance methods
export interface IPaymentAccountMethods {}

// Define PaymentAccount Schema
const PaymentAccountSchema = new Schema<
  IPaymentAccount,
  IPaymentAccountStatics,
  IPaymentAccountMethods
>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" }, // Reference to User
    fullName: { type: String, required: true }, // User's name from Worldcoin
    phoneNumber: { type: String, required: true, unique: true }, // Unique phone number
    walletId: { type: Schema.Types.ObjectId, ref: "Wallet", required: true }, // Reference to Wallet
    providerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Provider",
      // Reference to PayoutProvider
    },
    isdefault: { type: Boolean, default: false }, // Indicates default payment method
  },
  { timestamps: true }
);

// Static method to create a payment account
PaymentAccountSchema.statics.addPaymentAccount = async function ({
  userId,
  fullName,
  phoneNumber,
  walletId,
  providerId,
  isdefault = false,
}: {
  userId: Schema.Types.ObjectId;
  fullName: string;
  phoneNumber: string;
  walletId: Schema.Types.ObjectId;
  providerId: Schema.Types.ObjectId;
  isdefault?: boolean;
}) {
  return this.create({
    userId,
    fullName,
    phoneNumber,
    walletId,
    providerId,
    isdefault,
  });
};

// Static method to get a payment account by ID
PaymentAccountSchema.statics.getPaymentAccountById = async function ({
  accountId,
  userId,
}: {
  accountId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
}) {
  return this.findOne({
    _id: accountId,
    userId,
  }).populate({
    path: "providerId",
    select: "shortname processingTime",
  });
};

// Static method to get all payment accounts by user ID
PaymentAccountSchema.statics.getPaymentAccountsByUserId = async function ({
  userId,
  method,
}: {
  userId: Schema.Types.ObjectId;
  method: string;
}) {
  return this.find({ userId, providerId: method })
    .sort({ isdefault: -1 })
    .populate({
      path: "providerId",
      select: "shortname",
    });
};

// Use models to check if 'PaymentAccount' already exists to prevent recompilation issues
export const PaymentAccount =
  models.PaymentAccount ||
  model<IPaymentAccount, IPaymentAccountStatics>(
    "PaymentAccount",
    PaymentAccountSchema
  );
