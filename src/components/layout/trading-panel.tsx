"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useConnection } from "wagmi";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import {
  useParadexAccount,
  useParadexConnection,
  usePlaceOrder,
} from "@/hooks/use-paradex";
import type { ParadexAPI } from "@/lib/paradex";
import { tradingFormSchema, type tradingFormSchemaType } from "@/lib/zod";
import { useActionContext } from "@/providers/action";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import { Spinner } from "../ui/spinner";

export function TradingPanel() {
  const connection = useConnection();
  const { selectedMarket, paradexAPI, setParadexAPI } = useActionContext();

  const connectMutation = useParadexConnection();
  const { data: accountData, isLoading: isLoadingBalance } =
    useParadexAccount(paradexAPI);
  const placeOrderMutation = usePlaceOrder(paradexAPI);

  const isWalletDisconnected = connection.status === "disconnected";
  const isWalletConnected = connection.status === "connected";
  const isWalletConnecting = connection.status === "connecting";
  const isParadexConnected = !!paradexAPI;

  const balance = Number(accountData?.free_collateral) || 0;

  React.useEffect(() => {
    if (!isWalletConnected) {
      setParadexAPI(null);
    }
  }, [isWalletConnected, setParadexAPI]);

  const form = useForm<tradingFormSchemaType>({
    resolver: zodResolver(tradingFormSchema),
    defaultValues: {
      positionSize: "",
      leverage: 2,
    },
  });

  // const positionSize = form.watch("positionSize");
  // const leverage = form.watch("leverage");

  // const positionValue = Number(positionSize) || 0;
  // const effectivePosition = positionValue * leverage;
  // const marginRequired = positionValue;

  const onSubmit = async ({
    positionSize,
    leverage,
  }: tradingFormSchemaType) => {
    const positionValue = Number(positionSize) || 0;
    const effectivePosition = positionValue * leverage;

    if (!selectedMarket) {
      toast.error("Please select a market");
      return;
    }

    if (positionValue > balance) {
      form.setError("positionSize", { message: "Insufficient balance" });
      return;
    }

    await placeOrderMutation.mutateAsync(
      {
        market: selectedMarket.symbol,
        side: "BUY",
        type: "MARKET",
        size: effectivePosition.toString(),
        price: "0",
        instruction: "GTC",
      },
      {
        onSuccess: () => {
          form.reset({
            positionSize: "",
            leverage: 2,
          });
        },
      },
    );
  };

  const handleConnectParadex = async () => {
    try {
      const result = await connectMutation.mutateAsync();
      setParadexAPI(result.api);
    } catch (_error) {
      // Error is handled by mutation onError
    }
  };

  return (
    <Card
      data-slot="trading-panel"
      className="row-span-2 w-100 justify-between px-6"
    >
      <Form {...form}>
        <form
          id="trading-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <FormField
            control={form.control}
            name="positionSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position Size</FormLabel>
                <FormControl>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      placeholder="0.00"
                      className="[appearance:textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupText>USD</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between text-sm">
            <span className="font-medium leading-none">Available Balance:</span>
            {isLoadingBalance ? (
              <Skeleton className="h-5 w-20" />
            ) : (
              <span className="font-mono font-semibold tabular-nums">
                ${balance.toFixed(2)}
              </span>
            )}
          </div>

          <FormField
            control={form.control}
            name="leverage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Leverage</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="2"
                    type="number"
                    min={1}
                    max={50}
                    step={1}
                    className="[appearance:textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      <div>
        {(isWalletDisconnected || isWalletConnecting) && (
          <ConnectButton.Custom>
            {({ openConnectModal }) => {
              return (
                <div className="flex flex-col items-center rounded-[12px] bg-muted p-1">
                  <p className="mt-1 mb-2 text-sm">
                    Connect your wallet to start trading
                  </p>
                  <Button
                    className="w-full"
                    onClick={openConnectModal}
                    disabled={isWalletConnecting}
                  >
                    {isWalletConnecting && <Spinner />}
                    Connect Wallet
                  </Button>
                </div>
              );
            }}
          </ConnectButton.Custom>
        )}

        {isWalletConnected && !isParadexConnected && (
          <div className="flex flex-col items-center rounded-[12px] bg-muted p-1">
            <p className="mt-1 mb-2 text-sm">Sign message to access trading</p>
            <Button
              className="w-full"
              onClick={handleConnectParadex}
              disabled={connectMutation.isPending}
            >
              {connectMutation.isPending && <Spinner />}
              Connect Paradex Exchange
            </Button>
          </div>
        )}

        {isWalletConnected && isParadexConnected && (
          <Button
            type="submit"
            form="trading-form"
            className="w-full"
            disabled={placeOrderMutation.isPending}
          >
            {placeOrderMutation.isPending && <Spinner />}
            Place Trade
          </Button>
        )}
      </div>
    </Card>
  );
}
