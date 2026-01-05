export interface SystemConfig {
  readonly apiBaseUrl: string;
  readonly starknet: {
    readonly chainId: string;
  };
}

export interface OrderParams {
  market: string;
  side: "BUY";
  type: "MARKET";
  size: string;
  price: string;
  instruction: "GTC";
}

export interface Account {
  address: string;
  publicKey: string;
  ethereumAccount: string;
  privateKey: string;
  jwtToken?: string;
}

export interface Market {
  asset_kind: string;
  base_currency: string;
  chain_details: {
    collateral_address: string;
    contract_address: string;
    fee_account_address: string;
    fee_maker: string;
    fee_taker: string;
    insurance_fund_address: string;
    liquidation_fee: string;
    oracle_address: string;
    symbol: string;
  };
  clamp_rate: string;
  delta1_cross_margin_params: {
    imf_base: string;
    imf_factor: string;
    imf_shift: string;
    mmf_factor: string;
  };
  expiry_at: number;
  interest_rate: string;
  market_kind: string;
  max_funding_rate: string;
  max_funding_rate_change: string;
  max_open_orders: number;
  max_order_size: string;
  max_tob_spread: string;
  min_notional: string;
  open_at: number;
  option_cross_margin_params: {
    imf: {
      long_itm: string;
      premium_multiplier: string;
      short_itm: string;
      short_otm: string;
      short_put_cap: string;
    };
    mmf: {
      long_itm: string;
      premium_multiplier: string;
      short_itm: string;
      short_otm: string;
      short_put_cap: string;
    };
  };
  option_type: string;
  oracle_ewma_factor: string;
  order_size_increment: string;
  position_limit: string;
  price_bands_width: string;
  price_feed_id: string;
  price_tick_size: string;
  quote_currency: string;
  settlement_currency: string;
  strike_price: string;
  symbol: string;
}

export interface Position {
  account: string;
  average_entry_price: string;
  average_entry_price_usd: string;
  average_exit_price: string;
  cached_funding_index: string;
  closed_at: number;
  cost: string;
  cost_usd: string;
  created_at: number;
  id: string;
  last_fill_id: string;
  last_updated_at: number;
  leverage: string;
  liquidation_price: string;
  market: string;
  realized_positional_funding_pnl: string;
  realized_positional_pnl: string;
  seq_no: number;
  side: "LONG" | "SHORT";
  size: string;
  status: string;
  unrealized_funding_pnl: string;
  unrealized_pnl: string;
}

export interface AccountInfo {
  account: string;
  account_value: string;
  free_collateral: string;
  initial_margin_requirement: string;
  maintenance_margin_requirement: string;
  margin_cushion: string;
  seq_no: number;
  settlement_asset: string;
  status: string;
  total_collateral: string;
  updated_at: number;
}
