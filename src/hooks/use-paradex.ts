import { useQuery } from "@tanstack/react-query";
import type { Market } from "@/lib/types";
import { getRequest } from "@/server/api/axios";
import { API_URL } from "@/server/api/routes";

export const paradexQueryKeys = {
  markets: "markets",
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
