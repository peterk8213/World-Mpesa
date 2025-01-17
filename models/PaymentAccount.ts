import { Schema, model, models } from "mongoose";

const PaymentAccountSchema = new Schema(
  {
    userId: { type: String, required: true, unique: true, ref: "User" }, // User's World ID
    fullName: { type: String, required: true }, // User's name from Worldcoin
    phoneNumber: { type: String }, // Default payment method
    walletId: {
      type: Schema.Types.ObjectId,
      ref: "UWallet",
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

// Use models to check if 'User' model already exists to prevent recompilation issues

export const PaymentAccount =
  models.User || model("PaymentAccount", PaymentAccountSchema);
