export const APP_DOMAIN =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_SITE_URL
    : "http://localhost:3000";

export const PARADEX_DOMAIN =
  process.env.NODE_ENV === "production"
    ? "https://api.prod.paradex.trade/v1"
    : "https://api.testnet.paradex.trade/v1";

export const BASE_URL = {
  APP: APP_DOMAIN,
  PARADEX: PARADEX_DOMAIN,
};

export const API_URL = {
  PARADEX: {
    AUTH: "/auth",
    ONBOARDING: "/onboarding",
    SYSTEM_CONFIG: "/system/config",
    MARKETS: "/markets",
    ACCOUNT: "/account",
    POSITIONS: "/account/positions",
    ORDERS: "/orders",
  },
};
