export interface Address {
  state: string | null;
  country: string | null;
  line2: string | null;
  city: string | null;
  line1: string | null;
  postal_code: string | null;
}

export interface BillingDetails {
  email: string;
  phone: string | null;
  name: string;
  address: Address;
}

export interface Networks {
  supported: string[];
  preferred: string;
}

export interface USBankAccount {
  bank_name: string;
  fingerprint: string;
  financial_connections_account: string;
  routing_number: string;
  last4: string;
  account_holder_type: string;
  networks: Networks;
  status_details: object;
  account_type: string;
}

export interface FinancialConnectionData {
  object: string;
  id: string;
  billing_details: BillingDetails;
  livemode: boolean;
  us_bank_account: USBankAccount;
  created: number;
  allow_redisplay: string;
  type: string;
  customer: string;
  metadata: object;
}

export interface SavedAccountResponse {
  message: string;
  data: any[];
  financialConnectionsData: FinancialConnectionData[];
}
