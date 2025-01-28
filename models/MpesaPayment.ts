import mongoose, { Schema, models } from "mongoose";

// Define a schema for payments
const MpesaPaymentSchema = new Schema(
  {
    originatorConversationID: { type: String, required: true, unique: true },
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
    }, // Link to Transaction model,
    partyB: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    paymentAccountId: {
      type: Schema.Types.ObjectId,
      ref: "PaymentAccount",
    },
    transactionReceipt: { type: String, optional: true },
    B2CRecipientIsRegisteredCustomer: { type: String, optional: true },
    ReceiverPartyPublicName: { type: String, optional: true },
    TransactionCompletedDateTime: { type: String, optional: true },

    B2CWorkingAccountAvailableFunds: { type: Number, optional: true },
    resultCode: { type: Number, optional: true },
    resultDesc: { type: String, optional: true },
  },
  { timestamps: true }
);

MpesaPaymentSchema.statics.createPayment = async function ({
  originatorConversationID,
  transactionAmount,
  status,
  transactionId,
  paymentAccountId,
  userId,
}) {
  return this.create({
    originatorConversationID,
    transactionAmount,
    status,
    transactionId,
    paymentAccountId,
    userId,
  });
};
// static method to get a payment by ID
MpesaPaymentSchema.statics.getPaymentByTransactionId = async function ({
  transactionId,
  userId,
}) {
  return this.findOne({ transactionId, userId });
};
// static method to update payment status
MpesaPaymentSchema.statics.updatePaymentStatus = async function (
  transactionId,
  status,
  userId
) {
  return this.updateOne({ transactionId, userId }, { status });
};

// Static method to update a payment
MpesaPaymentSchema.statics.updatePayment = async function ({
  transactionAmount,
  userId,
  transactionId,
  status,
  partyB,
  transactionReceipt,
  B2CRecipientIsRegisteredCustomer,
  ReceiverPartyPublicName,
  TransactionCompletedDateTime,
  B2CWorkingAccountAvailableFunds,
  resultCode,
  resultDesc,
}) {
  return this.updateOne(
    { userId, transactionId },
    {
      transactionAmount,
      status,
      partyB,
      transactionReceipt,
      B2CRecipientIsRegisteredCustomer,
      ReceiverPartyPublicName,
      TransactionCompletedDateTime,
      B2CWorkingAccountAvailableFunds,
      resultCode,
      resultDesc,
    }
  );
};

// Create the Payment model
const MpesaPayment =
  models.MpesaPayment || mongoose.model("MpesaPayment", MpesaPaymentSchema);

export default MpesaPayment;
