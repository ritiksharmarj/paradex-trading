"use client";

import { useParadexPositions } from "@/hooks/use-paradex";
import { useActionContext } from "@/providers/action";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export function Positions() {
  const { paradexAPI } = useActionContext();
  const { data, isLoading } = useParadexPositions(paradexAPI);

  return (
    <Card data-slot="positions">
      <CardHeader>
        <CardTitle>Active Positions</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-1">
            {[...Array(4)].map((_, idx) => (
              <Skeleton key={idx} className="h-9 w-full" />
            ))}
          </div>
        ) : !data?.results.length ? (
          <div>No open positions</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Market</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>PnL</TableHead>
                <TableHead>Entry Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.results.map((pos) => (
                <TableRow key={pos.id}>
                  <TableCell>{pos.market}</TableCell>
                  <TableCell>{pos.size}</TableCell>
                  <TableCell>{pos.unrealized_pnl}</TableCell>
                  <TableCell>${pos.average_entry_price_usd}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
