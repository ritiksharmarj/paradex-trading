export const APP_DOMAIN =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_SITE_URL
    : "http://localhost:3000";

export const PARADEX_DOMAIN =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PARADEX_API_URL
    : "https://api.testnet.paradex.trade/v1";

export const BASE_URL = {
  APP: APP_DOMAIN,
  PARADEX: PARADEX_DOMAIN,
};
