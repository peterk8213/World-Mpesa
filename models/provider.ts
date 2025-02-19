///// model for storing  provider info/ ir bank mpesa airtime, airtel money

import { Schema, model, models } from "mongoose";

const ProviderSchema = new Schema(
  {
    name: { type: String, required: true, unique: true }, // Provider name
    shortname: { type: String, required: true, unique: true }, // Short name
    iconUrl: { type: String }, // Icon URL
    createdAt: { type: Date, default: Date.now }, // Creation date
    maxAmount: { type: Number, min: 1 }, // Maximum amount
    minAmount: { type: Number, min: 1 }, // Minimum amount
    fee: { type: Number, default: 0 }, // Fee
    processingTime: { type: String, default: "Instant" }, // Estimated time
    available: { type: Boolean, default: true }, // Availability status
    description: { type: String, default: "" }, // Description
  },
  { timestamps: true }
);

// Static method to create a provider

// Static method to create a provider
ProviderSchema.statics.addProvider = async function ({
  name,
  shortname,
  iconUrl,
  maxAmount,
  minAmount,
  fee,
  processingTime,
  available,
  description,
}: {
  name: string;
  shortname: string;
  iconUrl?: string;
  maxAmount: number;
  minAmount: number;
  fee: number;
  processingTime: string;
  available: boolean;
  description: string;
}) {
  console.log("Adding provider", {
    name,
    shortname,
    iconUrl,
    maxAmount,
    minAmount,
    fee,
    processingTime,
    available,
    description,
  });
  return this.create({
    name,
    shortname,
    iconUrl,
    maxAmount,
    minAmount,
    fee,
    processingTime,
    available,
    description,
  });
};

// Static method to get a provider by ID
ProviderSchema.statics.getProviderById = async function (providerId: string) {
  return this.findOne({ _id: providerId });
};

// Static method to get all providers
ProviderSchema.statics.getAllProviders = async function () {
  return await this.find().select("name _id").lean();
};

// Use models to check if 'Provider' model already exists to prevent recompilation issues

export const Provider = models.Provider || model("Provider", ProviderSchema);
