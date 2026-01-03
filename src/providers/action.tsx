"use client";

import * as React from "react";
import type { Market } from "@/lib/types";

interface ActionContextType {
  selectedMarket: Market | null;
  setSelectedMarket: React.Dispatch<React.SetStateAction<Market | null>>;
}

const ActionContext = React.createContext<ActionContextType | undefined>(
  undefined,
);

export const ActionProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedMarket, setSelectedMarket] = React.useState<Market | null>(
    null,
  );

  return (
    <ActionContext.Provider value={{ selectedMarket, setSelectedMarket }}>
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
