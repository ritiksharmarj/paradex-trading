export interface SystemConfig {
  readonly apiBaseUrl: string;
  readonly starknet: {
    readonly chainId: string;
  };
}

export interface Account {
  address: string;
  publicKey: string;
  ethereumAccount: string;
  privateKey: string;
  jwtToken?: string;
}

// Additional types for your app
export interface Market {
  symbol: string;
  base_currency: string;
  quote_currency: string;
  price_tick_size: string;
  quantity_tick_size: string;
  min_order_size: string;
  max_order_size: string;
}

export interface Position {
  market: string;
  side: "LONG" | "SHORT";
  size: string;
  entry_price: string;
  mark_price: string;
  unrealized_pnl: string;
}

export interface AccountInfo {
  address: string;
  balance: string;
  available_balance: string;
  margin_used: string;
}
