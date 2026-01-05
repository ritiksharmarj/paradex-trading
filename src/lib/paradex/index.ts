import { ethers } from "ethers";
import { ec, hash } from "starknet";
import { getSystemConfig, ParadexAPI } from "./api";
import type { Account } from "./types";

declare global {
  interface Window {
    ethereum: ethers.Eip1193Provider;
  }
}

// Key derivation - exact Paradex method
function grindKey(signature: string): string {
  const cleanSig = signature.toLowerCase().replace("0x", "");
  let counter = 0;

  while (counter < 10000) {
    const seed = cleanSig + counter.toString(16).padStart(2, "0");

    const keyPair = ec.starkCurve.grindKey(seed);
    const publicKey = ec.starkCurve.getStarkKey(keyPair);
    const addressBN = hash.computeHashOnElements([publicKey, 0]);

    // Paradex validation
    if (addressBN.toString().length <= 63) {
      return `0x${keyPair.toString().padStart(64, "0")}`;
    }

    counter++;
  }

  throw new Error("Failed to derive valid key");
}

export async function createParadexConnection(ethereumAddress: string) {
  try {
    // 1. Get system config from Paradex
    const config = await getSystemConfig();

    // 2. Request signature from user (this is the key step!)
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const message = "Sign this message to access Paradex";
    const signature = await signer.signMessage(message);

    // 3. Derive StarkNet keys
    const privateKey = grindKey(signature);
    const publicKeyBN = ec.starkCurve.getStarkKey(privateKey);

    const publicKeyHex = publicKeyBN.toString();
    const publicKey = `0x${publicKeyHex.replace(/^0x/, "").padStart(64, "0")}`;

    const addressBN = hash.computeHashOnElements([publicKeyBN, 0]);
    const addressHex = addressBN.toString();
    const address = `0x${addressHex.replace(/^0x/, "").padStart(64, "0")}`;

    // 4. Create account object
    const account: Account = {
      address,
      publicKey: publicKeyHex,
      privateKey,
      ethereumAccount: ethereumAddress,
    };

    // 5. Create API instance
    const api = new ParadexAPI(config, account);

    // 6. Onboard user
    await api.onboardUser();

    // 7. Authenticate and get JWT
    await api.authenticate();

    // 8. Verify connection by fetching account
    const accountInfo = await api.getAccount();

    return {
      api,
      account,
      config,
      accountInfo,
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export * from "./api";
export * from "./types";
