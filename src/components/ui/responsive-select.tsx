"use client";

import { CheckIcon, ChevronDownIcon, PlusIcon } from "lucide-react";
import * as React from "react";
import { useResponsive } from "@/hooks/use-responsive";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface ResponsiveSelectContextType {
  open: boolean;
  typedValue: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setTypedValue: React.Dispatch<React.SetStateAction<string>>;
}

const ResponsiveSelectContext = React.createContext<
  ResponsiveSelectContextType | undefined
>(undefined);

function ResponsiveSelect({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [typedValue, setTypedValue] = React.useState("");

  return (
    <ResponsiveSelectContext.Provider
      value={{ open, setOpen, typedValue, setTypedValue }}
    >
      <Popover open={open} onOpenChange={setOpen}>
        {children}
      </Popover>
    </ResponsiveSelectContext.Provider>
  );
}

export const useResponsiveSelectContext = () => {
  const context = React.useContext(ResponsiveSelectContext);
  if (context === undefined) {
    throw new Error(
      "useResponsiveSelectContext must be used within an ResponsiveSelect",
    );
  }
  return context;
};

interface ResponsiveSelectTriggerProps extends React.ComponentProps<"button"> {
  value?: string;
  error?: boolean;
}

function ResponsiveSelectTrigger({
  className,
  children,
  value,
  error,
  ...props
}: ResponsiveSelectTriggerProps) {
  return (
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        role="combobox"
        data-error={!!error}
        className={cn(
          "w-full justify-between gap-2 px-3 font-normal",
          "data-[error=true]:border-destructive data-[error=true]:ring-destructive/20",
          !value && "text-muted-foreground hover:text-muted-foreground",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon className="opacity-50" />
      </Button>
    </PopoverTrigger>
  );
}

function ResponsiveSelectContent({
  className,
  children,
  align = "start",
  ...props
}: React.ComponentProps<typeof PopoverContent>) {
  const { isDesktop } = useResponsive();

  return (
    <PopoverContent
      align={align}
      asChild // accessible with keyboard navigation
      onOpenAutoFocus={(e) => !isDesktop && e.preventDefault()} // disable autofocus on mobile devices
      className={cn(
        "w-auto min-w-(--radix-popover-trigger-width) p-0",
        className,
      )}
      {...props}
    >
      <Command loop className="w-full">
        {children}
      </Command>
    </PopoverContent>
  );
}

function ResponsiveSelectSearchInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandInput>) {
  const { setTypedValue } = useResponsiveSelectContext();

  return (
    <CommandInput
      className={className}
      onValueChange={setTypedValue}
      {...props}
    />
  );
}

function ResponsiveSelectList({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CommandList>) {
  return (
    <CommandList className={cn("p-1", className)} {...props}>
      {children}
    </CommandList>
  );
}

function ResponsiveSelectGroup({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CommandGroup>) {
  return (
    <CommandGroup className={className} {...props}>
      {children}
    </CommandGroup>
  );
}

interface ResponsiveSelectItemProps
  extends React.ComponentProps<typeof CommandItem> {
  onSelect: () => void;
  isItemSelected?: boolean;
}

function ResponsiveSelectItem({
  className,
  children,
  onSelect,
  isItemSelected,
  ...props
}: ResponsiveSelectItemProps) {
  const { setOpen, setTypedValue } = useResponsiveSelectContext();

  return (
    <CommandItem
      className={cn("cursor-pointer", className)}
      onSelect={() => {
        onSelect();
        setOpen(false);
        setTypedValue("");
      }}
      {...props}
    >
      {children}
      <CheckIcon
        className={cn(
          "ml-auto size-4 flex-none",
          isItemSelected ? "opacity-100" : "opacity-0",
        )}
      />
    </CommandItem>
  );
}

interface ResponsiveSelectOptionItemProps
  extends React.ComponentProps<typeof CommandItem> {
  onSelect: (value: string) => void;
}

function ResponsiveSelectOptionItem({
  className,
  onSelect,
  ...props
}: ResponsiveSelectOptionItemProps) {
  const { typedValue, setOpen, setTypedValue } = useResponsiveSelectContext();

  if (!typedValue) return null;

  return (
    <CommandItem
      value="9999" // random number to always keep this item at the end
      forceMount
      onSelect={() => {
        onSelect(typedValue);
        setOpen(false);
        setTypedValue("");
      }}
      className={cn("cursor-pointer", className)}
      {...props}
    >
      <PlusIcon className="mr-2 size-4" />
      Add &quot;{typedValue}&quot;
    </CommandItem>
  );
}

export {
  ResponsiveSelect,
  ResponsiveSelectTrigger,
  ResponsiveSelectContent,
  ResponsiveSelectSearchInput,
  ResponsiveSelectList,
  ResponsiveSelectGroup,
  ResponsiveSelectItem,
  ResponsiveSelectOptionItem,
};
