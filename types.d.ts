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
  icon: string;
  available: boolean;
}

export type Status = "active" | "inactive" | "banned";
