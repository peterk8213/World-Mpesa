"use server";

import dbConnect from "@/lib/mongodb";
import RefundRequest, {
  RefundStatus,
  RefundCurrency,
  type IRefundRequest,
} from "@/models/refund";

import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { SubmitRefundParams, RefundResponse } from "@/types";

function isValidWorldChainAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Submit a new refund request
 */
export async function submitRefundRequest(
  params: SubmitRefundParams
): Promise<RefundResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return {
        success: false,
        error: "Unauthorized",
        details: ["User session not found"],
      };
    }
    // Connect to the database
    const { amount, currency } = params;
    const walletAddress = params.walletAddress?.trim();
    if (!amount || !walletAddress || !currency) {
      return {
        success: false,
        error: "Missing required parameters",
        details: ["Amount and wallet address are required"],
      };
    }
    if (amount <= 0) {
      return {
        success: false,
        error: "Invalid amount",
        details: ["Amount must be greater than 0"],
      };
    }

    const { userId } = session as Session;
    await dbConnect();

    // Validate wallet address format
    const isValidAddress = isValidWorldChainAddress(walletAddress);
    console.log("isValidAddress", isValidAddress);
    console.log("walletAddress", walletAddress);
    if (!isValidAddress) {
      console.error(`-${walletAddress}- is not a valid Worldchain address`);
      return {
        success: false,
        error: "Invalid wallet address format",
        details: ["Wallet address must be a valid Worldchain address"],
      };
    }

    // Create new refund request
    const refundRequest: IRefundRequest = new RefundRequest({
      userId: userId,
      amount: params.amount,
      walletAddress: params.walletAddress,
      inputToken: params.currency || RefundCurrency.WLD,
      notes: params.notes || "",
    });

    // Save to database
    await refundRequest.save();

    return {
      success: true,
      data: {
        id: refundRequest._id.toString(),
      },
    };
  } catch (error: any) {
    console.error("Error creating refund request:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err: any) => err.message
      );
      return {
        success: false,
        error: "Validation failed",
        details: validationErrors,
      };
    }

    return {
      success: false,
      error: "Failed to create refund request",
    };
  }
}

/**
 * Get refund requests for a user
 */
export async function getUserRefundRequests(
  userId: string
): Promise<IRefundRequest[]> {
  try {
    // Connect to the database
    await dbConnect();

    // Fetch user session
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new Error("Unauthorized");
    }

    // Fetch refund requests for the user
    const refundRequests = await RefundRequest.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);

    return refundRequests;
  } catch (error) {
    console.error("Error fetching user refund requests:", error);
    return [];
  }
}

/**
 * Get all refund requests (admin function)
 */
export async function getAllRefundRequests(
  status?: RefundStatus,
  limit = 100
): Promise<IRefundRequest[]> {
  try {
    const query: any = {};
    if (status) query.status = status;

    // Connect to the database
    await dbConnect();

    const refundRequests = await RefundRequest.find(query)
      .sort({ createdAt: -1 })
      .limit(limit);

    return refundRequests;
  } catch (error) {
    console.error("Error fetching all refund requests:", error);
    return [];
  }
}

/**
 * Update refund request status (admin function)
 */
export async function updateRefundStatus(
  refundId: string,
  status: RefundStatus,
  notes?: string
): Promise<boolean> {
  try {
    // Connect to the database
    await dbConnect();
    // Fetch user session
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new Error("Unauthorized");
    }
    const refundRequest = await RefundRequest.findById(refundId);

    if (!refundRequest) {
      console.error("Refund request not found:", refundId);
      return false;
    }

    if (!refundRequest) {
      return false;
    }

    refundRequest.status = status;

    if (notes) {
      refundRequest.notes = notes;
    }

    // If status is completed or failed, set processedAt
    if (status === RefundStatus.COMPLETED || status === RefundStatus.FAILED) {
      refundRequest.processedAt = new Date();
    }

    await refundRequest.save();
    return true;
  } catch (error) {
    console.error("Error updating refund status:", error);
    return false;
  }
}
