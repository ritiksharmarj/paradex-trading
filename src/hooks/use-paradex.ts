import { useQuery } from "@tanstack/react-query";
import type { Market } from "@/lib/types";
import { useParadexContext } from "@/providers/paradex";
import { getRequest } from "@/server/api/axios";
import { API_URL } from "@/server/api/routes";

export const paradexQueryKeys = {
  markets: "markets",
  balance: "balance",
  positions: "positions",
};

export const useGetMarkets = () => {
  const getMarketsAxios = (): Promise<{ results: Market[] }> => {
    return getRequest({
      base: "PARADEX",
      url: API_URL.PARADEX.MARKETS,
    });
  };

  return useQuery({
    queryKey: [paradexQueryKeys.markets],
    queryFn: getMarketsAxios,
  });
};

export const useGetBalance = () => {
  const { paradex, isConnected } = useParadexContext();

  return useQuery({
    queryKey: [paradexQueryKeys.balance, paradex?.getAddress()],
    queryFn: async () => {
      if (!paradex) throw new Error("Paradex not connected");
      const balance = await paradex.getTokenBalance("USDC");
      return balance;
    },
    enabled: isConnected && !!paradex,
  });
};
