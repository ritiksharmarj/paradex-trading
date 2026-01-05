"use client";

import * as React from "react";
import {
  ResponsiveSelect,
  ResponsiveSelectContent,
  ResponsiveSelectItem,
  ResponsiveSelectList,
  ResponsiveSelectSearchInput,
  ResponsiveSelectTrigger,
} from "@/components/ui/responsive-select";
import { useGetMarkets } from "@/hooks/use-paradex";
import type { Market as MarketType } from "@/lib/paradex";
import { useActionContext } from "@/providers/action";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export function Market() {
  const { data, isLoading } = useGetMarkets();
  const [selectedMarket, setSelectedMarket] = React.useState("");
  const { setSelectedMarket: setMarketChange } = useActionContext();

  React.useEffect(() => {
    if (data?.results && data.results.length > 0 && !selectedMarket) {
      const firstMarket = data.results[0].symbol;
      setSelectedMarket(firstMarket);
      setMarketChange(data.results[0]);
    }
  }, [data, selectedMarket, setMarketChange]);

  function handleMarketChange(market: MarketType) {
    setSelectedMarket(market.symbol);
    setMarketChange(market);
  }

  return (
    <Card
      data-slot="market"
      className="h-20 flex-row gap-0 overflow-hidden p-0"
    >
      {isLoading ? (
        <div className="flex w-48 items-center px-6">
          <Skeleton className="h-9 w-full" />
        </div>
      ) : (
        <ResponsiveSelect>
          <ResponsiveSelectTrigger
            value={selectedMarket}
            className="h-full w-48 rounded-none border-none px-6! shadow-none"
          >
            <span className="truncate">{selectedMarket}</span>
          </ResponsiveSelectTrigger>
          <ResponsiveSelectContent className="min-w-64">
            <ResponsiveSelectSearchInput placeholder="Search markets..." />
            <ResponsiveSelectList>
              {!data?.results.length ? (
                <span>Oops! There's no available markets here...</span>
              ) : (
                data.results.map((market) => (
                  <ResponsiveSelectItem
                    key={market.symbol}
                    value={market.symbol}
                    onSelect={() => handleMarketChange(market)}
                    isItemSelected={market.symbol === selectedMarket}
                  >
                    {market.symbol}
                  </ResponsiveSelectItem>
                ))
              )}
            </ResponsiveSelectList>
          </ResponsiveSelectContent>
        </ResponsiveSelect>
      )}

      <div
        data-slot="market-info"
        className="flex grow items-center gap-2 border-l px-6 text-sm"
      >
        <div className="flex w-full flex-col items-center">
          <span className="mb-0.5 text-muted-foreground">Price</span>
          <span className="font-mono font-semibold text-lg tabular-nums">
            $89,000
          </span>
        </div>

        <div className="flex w-full flex-col items-center">
          <span className="mb-0.5 text-muted-foreground">Funding</span>
          <span className="font-mono font-semibold text-lg tabular-nums">
            0.01%
          </span>
        </div>

        <div className="flex w-full flex-col items-center">
          <span className="mb-0.5 text-muted-foreground">Volume</span>
          <span className="font-mono font-semibold text-lg tabular-nums">
            4.2B
          </span>
        </div>
      </div>
    </Card>
  );
}
