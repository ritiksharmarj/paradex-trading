"use client";

import * as React from "react";
import type { Market, ParadexAPI } from "@/lib/paradex";

interface ActionContextType {
  selectedMarket: Market | null;
  setSelectedMarket: React.Dispatch<React.SetStateAction<Market | null>>;
  paradexAPI: ParadexAPI | null;
  setParadexAPI: React.Dispatch<React.SetStateAction<ParadexAPI | null>>;
}

const ActionContext = React.createContext<ActionContextType | undefined>(
  undefined,
);

export const ActionProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedMarket, setSelectedMarket] = React.useState<Market | null>(
    null,
  );
  const [paradexAPI, setParadexAPI] = React.useState<ParadexAPI | null>(null);

  return (
    <ActionContext.Provider
      value={{ selectedMarket, setSelectedMarket, paradexAPI, setParadexAPI }}
    >
      {children}
    </ActionContext.Provider>
  );
};

export const useActionContext = () => {
  const context = React.useContext(ActionContext);
  if (context === undefined) {
    throw new Error("useActionContext must be used within an ActionProvider");
  }
  return context;
};
