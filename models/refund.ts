import mongoose, { Schema, type Document, type Model } from "mongoose";

// Define the status enum for refund requests
export enum RefundStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
}

// Define the currency enum
export enum RefundCurrency {
  WLD = "WLD",
  USDCE = "USDCE",
}

// Interface for the Refund Request document
export interface IRefundRequest extends Document {
  _id: string;
  userId: string;
  processedBy?: string;
  amount: number;
  walletAddress: string;
  inputToken: RefundCurrency;
  tokenAmount?: number;
  status: RefundStatus;

  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  processedAt?: Date;
}

// Create the schema
const RefundRequestSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, "User ID is required"],
      index: true,
      ref: "User",
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than 0"],
    },
    processedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    walletAddress: {
      type: String,
      required: [true, "Wallet address is required"],
      validate: {
        validator: (v: string) => {
          // Basic validation for Worldchain addresses
          return /^0x[a-fA-F0-9]{40}$/.test(v);
        },
        message: (props: { value: string }) =>
          `${props.value} is not a valid Worldchain address!`,
      },
    },
    InputToken: {
      type: String as () => RefundCurrency,
      enum: Object.values(RefundCurrency),
      default: RefundCurrency.WLD,
    },
    status: {
      type: String as () => RefundStatus,
      enum: Object.values(RefundStatus),
      default: RefundStatus.PENDING,
    },
    tokenAmount: {
      type: Number,
      min: [0.5, "Token amount must be greater than 0"],
    },
    notes: {
      type: String,
      maxlength: [500, "Notes cannot be more than 500 characters"],
    },
    processedAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

// Add indexes for common queries
RefundRequestSchema.index({ userId: 1, createdAt: -1 });
RefundRequestSchema.index({ status: 1, createdAt: -1 });

// Create and export the model
let RefundRequest: Model<IRefundRequest>;

// Handle model compilation for Next.js hot reloading
try {
  // Try to retrieve existing model to avoid model overwrite error
  RefundRequest = mongoose.model<IRefundRequest>("RefundRequest");
} catch {
  // Model doesn't exist yet, create it
  RefundRequest = mongoose.model<IRefundRequest>(
    "RefundRequest",
    RefundRequestSchema
  );
}

export default RefundRequest;
