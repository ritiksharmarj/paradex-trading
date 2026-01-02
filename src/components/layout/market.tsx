import { Card } from "../ui/card";

export function Market() {
  return (
    <Card data-slot="market" className="flex-row">
      <div data-slot="market-selector">market selector</div>

      <div data-slot="market-info">market info (hardcoded)</div>
    </Card>
  );
}
