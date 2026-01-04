import * as Paradex from "@paradex/sdk";
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum: ethers.Eip1193Provider;
  }
}

export async function createParadexConnection() {
  // 1. Fetch configuration for testnet
  const config = await Paradex.Config.fetch("testnet");

  // 2. Create signer from wallet client
  const provider = new ethers.BrowserProvider(window.ethereum);
  const ethersSigner = await provider.getSigner();
  const signer = Paradex.Signer.fromEthers(ethersSigner);

  // 3. Create Paradex client
  const client = await Paradex.Client.fromEthSigner({ config, signer });

  const starknetAddress = client.getAddress();
  const starknetProvider = client.getProvider();

  return client;
}
