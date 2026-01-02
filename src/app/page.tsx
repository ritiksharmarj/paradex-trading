import { ActivePositions } from "@/components/layout/active-positions";
import { Header } from "@/components/layout/header";
import { Market } from "@/components/layout/market";
import { TradingPanel } from "@/components/layout/trading-panel";

export default function Home() {
  return (
    <div className="min-h-dvh grid grid-cols-[1fr_auto] grid-rows-[auto_auto_1fr] p-4 mx-auto max-w-400 bg-muted gap-4">
      <Header />
      <Market />
      <TradingPanel />
      <ActivePositions />
    </div>
  );
}
