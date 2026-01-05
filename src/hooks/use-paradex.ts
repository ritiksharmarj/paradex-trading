import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useConnection } from "wagmi";
import {
  createParadexConnection,
  type Market,
  type OrderParams,
  type ParadexAPI,
} from "@/lib/paradex";
import { getRequest } from "@/server/api/axios";
import { API_URL } from "@/server/api/routes";

export const paradexQueryKeys = {
  markets: "markets",
  account: "account",
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

export function useParadexConnection() {
  const { address } = useConnection();

  return useMutation({
    mutationFn: async () => {
      if (!address) throw new Error("Wallet not connected");
      return createParadexConnection(address);
    },
    onSuccess: () => {
      toast.success("Connected to Paradex Exchange");
    },
    onError: (error: Error) => {
      console.error("Connection error:", error);
      toast.error(error.message || "Failed to connect to Paradex");
    },
  });
}

export function useParadexPositions(api: ParadexAPI | null) {
  const { address } = useConnection();

  return useQuery({
    queryKey: [paradexQueryKeys.positions, address],
    queryFn: async () => {
      if (!api) throw new Error("Paradex not connected");
      return api.getPositions();
    },
    enabled: !!api && !!address,
  });
}

export function useParadexAccount(api: ParadexAPI | null) {
  const { address } = useConnection();

  return useQuery({
    queryKey: [paradexQueryKeys.account],
    queryFn: async () => {
      if (!api) throw new Error("Paradex not connected");
      return api.getAccount();
    },
    enabled: !!api && !!address,
  });
}

export function usePlaceOrder(api: ParadexAPI | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: OrderParams) => {
      if (!api) throw new Error("Paradex not connected");
      return api.createOrder(params);
    },
    onSuccess: () => {
      toast.success("Order placed successfully!");

      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: [paradexQueryKeys.markets] });
      queryClient.invalidateQueries({ queryKey: [paradexQueryKeys.positions] });
      queryClient.invalidateQueries({ queryKey: [paradexQueryKeys.account] });
    },
    onError: (error: any) => {
      console.error("Order placement error:", error);

      const message = error.message?.toLowerCase() || "";
      if (message.includes("insufficient")) {
        toast.error("Insufficient balance for this trade");
      } else if (message.includes("minimum")) {
        toast.error("Order size below minimum requirement");
      } else if (message.includes("maximum")) {
        toast.error("Order size exceeds maximum limit");
      } else if (message.includes("market")) {
        toast.error("Market is currently unavailable");
      } else {
        toast.error(error.message || "Failed to place order");
      }
    },
  });
}
