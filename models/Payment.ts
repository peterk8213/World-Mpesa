import mongoose, { Schema } from "mongoose";

// Define a schema for payments
const paymentSchema = new Schema(
  {
    originatorConversationID: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, required: true, enum: ["pending", "completed"] },
    transactionId: {
      type: Schema.Types.ObjectId,
      ref: "Transaction",
      required: true,
      unique: true,
    }, // Link to Transaction model,
    partyB: { type: String, required: true },
    transactionCode: { type: String, optional: true },
    B2CWorkingAccountAvailableFunds: { type: Number, optional: true },
    resultCode: { type: Number, optional: true },
    resultDesc: { type: String, optional: true },
  },
  { timestamps: true }
);

// Create the Payment model
const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
