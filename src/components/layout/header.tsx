import { ConnectButton } from "@rainbow-me/rainbowkit";

export function Header() {
  return (
    <div
      data-slot="header"
      className="col-span-full flex items-center justify-between"
    >
      <div className="font-mono font-bold text-2xl select-none">Paradex</div>
      {/* <Button>Connect Wallet</Button> */}
      <ConnectButton />
    </div>
  );
}
