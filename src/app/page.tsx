import { Header } from "@/components/layout/header";
import { Market } from "@/components/layout/market";
import { Positions } from "@/components/layout/positions";
import { TradingPanel } from "@/components/layout/trading-panel";

export default function Home() {
  return (
    <div className="mx-auto grid min-h-dvh max-w-400 grid-cols-[1fr_auto] grid-rows-[auto_auto_1fr] gap-4 bg-muted p-4">
      <Header />
      <Market />
      <TradingPanel />
      <Positions />
    </div>
  );
}
