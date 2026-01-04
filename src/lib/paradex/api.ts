import { shortString } from "starknet";
import { getRequest, postRequest } from "@/server/api/axios";
import { API_URL } from "@/server/api/routes";
import { signAuthRequest, signOnboardingRequest, signOrder } from "./signature";
import type { Account, AccountInfo, Market, SystemConfig } from "./types";

export class ParadexAPI {
  private config: SystemConfig;
  private account: Account;

  constructor(config: SystemConfig, account: Account) {
    this.config = config;
    this.account = account;
  }

  async onboardUser(): Promise<void> {
    const timestamp = Date.now();
    const signature = signOnboardingRequest(this.config, this.account);

    await postRequest({
      base: "PARADEX",
      url: API_URL.PARADEX.ONBOARDING,
      data: {
        public_key: this.account.publicKey,
      },
      headers: {
        "PARADEX-ETHEREUM-ACCOUNT": this.account.ethereumAccount,
        "PARADEX-STARKNET-ACCOUNT": this.account.address,
        "PARADEX-STARKNET-SIGNATURE": signature,
        "PARADEX-TIMESTAMP": timestamp.toString(),
      },
    });

    console.log("Onboarding successful");
  }

  async authenticate(): Promise<string> {
    const { signature, timestamp, expiration } = signAuthRequest(
      this.config,
      this.account,
    );

    const response = await postRequest({
      base: "PARADEX",
      url: API_URL.PARADEX.AUTH,
      headers: {
        "PARADEX-STARKNET-ACCOUNT": this.account.address,
        "PARADEX-STARKNET-SIGNATURE": signature,
        "PARADEX-TIMESTAMP": timestamp.toString(),
        "PARADEX-SIGNATURE-EXPIRATION": expiration.toString(),
      },
    });

    this.account.jwtToken = response.jwt_token;
    return response.jwt_token;
  }

  async getAccount(): Promise<AccountInfo> {
    if (!this.account.jwtToken) {
      throw new Error("Not authenticated");
    }

    return getRequest({
      base: "PARADEX",
      url: API_URL.PARADEX.ACCOUNT,
      headers: {
        Authorization: `Bearer ${this.account.jwtToken}`,
      },
    });
  }

  async getPositions(): Promise<{ results: any[] }> {
    if (!this.account.jwtToken) {
      throw new Error("Not authenticated");
    }

    return getRequest({
      base: "PARADEX",
      url: API_URL.PARADEX.POSITIONS,
      headers: {
        Authorization: `Bearer ${this.account.jwtToken}`,
      },
    });
  }

  async createOrder(orderDetails: {
    market: string;
    side: "BUY" | "SELL";
    type: "MARKET" | "LIMIT";
    size: string;
    price?: string;
    instruction?: string;
  }): Promise<any> {
    if (!this.account.jwtToken) {
      throw new Error("Not authenticated");
    }

    const timestamp = Date.now();
    const signature = signOrder(
      this.config,
      this.account,
      {
        market: orderDetails.market,
        side: orderDetails.side,
        type: orderDetails.type,
        size: orderDetails.size,
        price: orderDetails.price || "0",
      },
      timestamp,
    );

    return postRequest({
      base: "PARADEX",
      url: API_URL.PARADEX.ORDERS,
      data: {
        ...orderDetails,
        signature: signature,
        signature_timestamp: timestamp,
      },
      headers: {
        Authorization: `Bearer ${this.account.jwtToken}`,
      },
    });
  }

  getJWT(): string | undefined {
    return this.account.jwtToken;
  }
}

export async function getSystemConfig(): Promise<SystemConfig> {
  const response = await getRequest({
    base: "PARADEX",
    url: API_URL.PARADEX.SYSTEM_CONFIG,
  });

  return {
    apiBaseUrl: "https://api.testnet.paradex.trade/v1",
    starknet: {
      chainId:
        response.starknet_chain_id ||
        shortString.encodeShortString("PRIVATE_SN_POTC_SEPOLIA"),
    },
  };
}

export async function listMarkets(): Promise<{ results: Market[] }> {
  return getRequest({
    base: "PARADEX",
    url: API_URL.PARADEX.MARKETS,
  });
}
