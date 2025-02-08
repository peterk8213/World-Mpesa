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

export interface WithdrawalMethod {
  id: string;
  name: string;
  iconUrl: string;
  available: boolean;
  minAmount?: number;
  maxAmount?: number;
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
  id: string;
  provider: string;
  phoneNumber: string;

  holderName: string;
  addedOn: string;
}

export interface InitiateWithdrawData {
  amount: string;
  method: string;
  accountId: string;
}

interface OrderDetails {
  amount: string;
  fees: number;
  totalAmount: number;
  walletBalance: number;
  estimatedTime: string;
  method: string;
  fiatAmount: number;
  conversionRate: number;
}
export interface ConversionRate {
  conversionRate: number;
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
