import { Schema, model, models } from "mongoose";
import { unique } from "next/dist/build/utils";

const PaymentAccountSchema = new Schema(
  {
    userId: { type: String, required: true, ref: "User" }, // User's World ID
    fullName: { type: String, required: true }, // User's name from Worldcoin
    phoneNumber: { type: String, required: true, unique: true }, // Default payment method
    walletId: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
    },
    provider: {
      _id: { type: String, required: true, ref: "PayoutProvider" },
      shortname: { type: String, required: true },
    }, // Reference to the PayoutProvider model
    isdefault: { type: Boolean, default: false }, // Default payment method
  },
  { timestamps: true }
);

// static method to create a payment account

PaymentAccountSchema.statics.addPaymentAccount = async function ({
  userId,
  fullName,
  phoneNumber,
  walletId,
  isdefault,
}) {
  return this.create({
    userId,
    fullName,
    phoneNumber,
    walletId,
    isdefault,
  });
};

// static method to get a payment account by ID
PaymentAccountSchema.statics.getPaymentAccountById = async function ({
  accountId,
  userId,
}: {
  accountId: string;
  userId: string;
}) {
  return this.findOne({ _id: accountId, userId });
};

// static method to get all payment accounts by user ID
PaymentAccountSchema.statics.getPaymentAccountsByUserId = async function ({
  userId,
}) {
  return this.find({ userId }, { sort: { isdefault: -1 } });
};

// Use models to check if 'User' model already exists to prevent recompilation issues

export const PaymentAccount =
  models.PaymentAccount || model("PaymentAccount", PaymentAccountSchema);
