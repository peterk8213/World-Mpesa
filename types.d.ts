import exp from "constants";

export interface Amount {
  WLD: number;
  USDCE: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
}
type PaymentMethod = {
  id: string;
  fullName: string;
  phone: string;
  provider: string;
};

export interface ManualPayout {
  _id: string;
  transactionId: string;
  phoneNumber: string;
  currency: string;
  status: "pending" | "completed" | "failed";
  fees?: number;
  processedBy?: string; // Admin or system user ID (ObjectId as string)
  amountinKes: number;
  amountinUsd: number;
  actualCharges?: number;
  userId: string; // User ID (ObjectId as string)
  confirmationCode?: string;
  notes?: string;
  ReceiverPartyPublicName?: string;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
}

// Input type for the completion form/action
export interface CompletePayoutInput {
  payoutId: string;
  adminId: string; // Assuming this comes from session or context
  status: "completed" | "failed";
  confirmationCode?: string;
  notes?: string;
  actualCharges?: number;
}

export interface WithdrawalMethod {
  _id: string;
  name: string;
  shortname: string;
  iconUrl: string;
  available: boolean;
  minAmount: number;
  maxAmount: number;
  processingTime: string;
  fees?: string;
  description?: string;
}

export interface WithdrawConfirmProps {
  method: string;
  amount: string;
  balance: number;
  processWithdrawal: (
    method: string,
    amount: string
  ) => Promise<{ success: boolean; transactionId?: string; error?: string }>;
}

export interface PaymentAccount {
  _id: Schema.Types.ObjectId;
  providerId: {
    _id: string;

    shortname: string;
  };
  phoneNumber: string;
  isdefault: boolean;
  userId: string;

  fullName: string;
  createdAt: string;
}

interface PayoutProvider {
  _id?: string; // Optional for new documents, automatically added by MongoDB
  name: string; // Provider name (e.g., "M-Pesa", "Airtel Money")
  shortname: string; // Short name or abbreviation (e.g., "MPESA", "AIRTEL")
  icon: string; // URL to the provider's icon
  maxAmount: number; // Maximum transaction amount
  minAmount: number; // Minimum transaction amount
  fee: number; // Transaction fee
  processingTime: string; // Estimated processing time (e.g., "Instant", "1-2 Business Days")
  available: boolean; // Whether the provider is currently available
  description: string; // Description of the provider
  createdAt?: Date; // Automatically added by Mongoose
  updatedAt?: Date; // Automatically added by Mongoose
}

export interface WithdrawalMethod {
  _id: string;
  name: string;
  iconUrl: string;
  available: boolean;
  minAmount?: number;
  maxAmount?: number;
  processingTime: string;
  fees?: string;
  description?: string;
}

export interface InitiateWithdrawData {
  amount: string;
  method: string;
  accountId: string;
  userId: string;
}

interface OrderDetails {
  amount: string;
  fees: {
    totalFee: number;
    netAmount: number;
  };
  totalAmount: number;
  walletBalance: number;

  method: string;
  fiatAmount: number;
  conversionRate: number;
}
export interface ConversionRate {
  conversionRate: number;
}

export interface WalletBalanceResponse {
  success: boolean;
  data?: WalletBalanceResponseData;
  error?: string;
}
interface WalletBalanceResponseData {
  balance: number;
  currency: string;
}
export interface ConversionRateApiResponse {
  success: boolean;
  data?: ConversionRate;
  error?: string;
}

export interface WithdrawRequestCheckout {
  processdata: InitiateWithdrawData;
  orderDetails: OrderDetails;
  accountdetails: AccountDetails;
}

export interface WithdrawKeypadProps {
  method: string;
  account: string;
  balance: number;
  conversionRate: ConversionRate;
}

interface AccountDetails {
  accountHolderName: string;
  phoneNumber: string;
  provider: string;
  estimatedTime: string;
}

export interface WithdrawPageProps {
  method: string;
  amount: string;
  balance: number;
  processWithdrawal: () => void;
}

// interface WithdrawalAccount {
//   id: string;
//   provider: string;
//   phoneNumber: string;
//   holderName: string;
//   addedOn: string;
// }

export type Status = "active" | "inactive" | "banned";

export interface Wallet {
  _id: string;
  userId: string;
  balance: Amount;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export interface MpesaPayment {
  tracking_id: string;
  request_reference_id?: string;
  walletId: Schema.Types.ObjectId;
  transactionAmount: number;
  status: "pending" | "completed" | "failed";
  transactionId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  paymentAccountId?: Schema.Types.ObjectId;
  reference: string;
  currency: string;
  actualCharges?: number;
  estimatedCharges?: number;
  ReceiverPartyPublicName?: string;
  paid_amount?: string;
  resultCode?: string;
  resultDesc?: string;
  phoneNumber?: string;
}
