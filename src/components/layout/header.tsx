"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { CheckIcon, ChevronDownIcon, CopyIcon, LogOutIcon } from "lucide-react";
import { toast } from "sonner";
import { useChains, useDisconnect, useSwitchChain } from "wagmi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

export function Header() {
  const disconnect = useDisconnect();
  const switchChain = useSwitchChain();
  const chains = useChains();

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast.success("Address copied!");
  };

  return (
    <div
      data-slot="header"
      className="col-span-full flex items-center justify-between"
    >
      <div className="select-none font-bold font-mono text-2xl">Paradex</div>

      <ConnectButton.Custom>
        {({ account, chain, openConnectModal, mounted }) => {
          const connected = mounted && account && chain;

          return (
            <>
              {!mounted && (
                <div className="flex items-center gap-2">
                  <Skeleton className="h-9 w-30" />
                  <Skeleton className="h-9 w-30" />
                </div>
              )}

              {mounted && !connected && (
                <Button onClick={openConnectModal}>Connect Wallet</Button>
              )}

              {connected && (
                <div className="flex items-center gap-2">
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        {chain.name} <ChevronDownIcon />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Switch Networks</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        {chains.map((x) => (
                          <DropdownMenuItem
                            key={x.id}
                            onSelect={() =>
                              switchChain.mutate({ chainId: x.id })
                            }
                          >
                            {x.name}
                            {chain.id === x.id && (
                              <CheckIcon className="ml-auto" />
                            )}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        {account.displayName} <ChevronDownIcon />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>
                          Balance: {account.displayBalance}
                        </DropdownMenuLabel>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          onSelect={() => copyAddress(account.address)}
                        >
                          <CopyIcon /> Copy Address
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => disconnect.mutate()}>
                          <LogOutIcon /> Disconnect
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </>
          );
        }}
      </ConnectButton.Custom>
    </div>
  );
}
