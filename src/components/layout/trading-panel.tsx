"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useForm } from "react-hook-form";
import { useConnection } from "wagmi";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
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

const MOCK_BALANCE = 500;

export function TradingPanel() {
  const connection = useConnection();
  const { selectedMarket } = useActionContext();
  // const {
  //   paradex,
  //   isConnecting: isParadexConnecting,
  //   isConnected: isParadexConnected,
  //   error: paradexError,
  //   handleConnect,
  // } = useParadexContext();

  const isWalletDisconnected = connection.status === "disconnected";
  const isWalletConnected = connection.status === "connected";
  const isWalletConnecting = connection.status === "connecting";

  const form = useForm<tradingFormSchemaType>({
    resolver: zodResolver(tradingFormSchema),
    defaultValues: {
      positionSize: "",
      leverage: 2,
    },
  });

  const positionSize = form.watch("positionSize");
  const leverage = form.watch("leverage");

  const positionValue = Number(positionSize) || 0;
  const effectivePosition = positionValue * leverage;
  const marginRequired = positionValue / leverage;

  const onSubmit = (values: tradingFormSchemaType) => {
    console.log({
      selectedMarket: selectedMarket?.symbol,
      ...values,
      effectivePosition,
      marginRequired,
    });
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
                      type="number"
                      min={0}
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
            <span className="font-mono font-semibold tabular-nums">
              ${MOCK_BALANCE}
            </span>
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
                  Connect Wallet
                </Button>
              </div>
            );
          }}
        </ConnectButton.Custom>
      )}

      {/* {isWalletConnected && !isParadexConnected && (
        <div className="flex flex-col items-center rounded-[12px] bg-muted p-1">
          <p className="mt-1 mb-2 text-sm">Sign message to access trading</p>
          <Button
            className="w-full"
            onClick={handleConnect}
            disabled={isParadexConnecting}
          >
            Connect Paradex Exchange
          </Button>
        </div>
      )} */}

      {isWalletConnected && (
        <Button type="submit" form="trading-form">
          Place Trade
        </Button>
      )}
    </Card>
  );
}
