"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { type DialogProps } from "@radix-ui/react-dialog";
import { useHotkeys } from "@mantine/hooks";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { MAIN_NAV, MainNavItems } from "@/lib/nav";
import * as Icons from "./icons";
import { BetaBadge } from "./beta-badge";

interface CommandMenuProps extends DialogProps {
  noMaxWidth?: boolean;
}

export function CommandMenu({ noMaxWidth, ...props }: CommandMenuProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  useHotkeys([
    ["/", () => setOpen((open) => !open)],
    ["ctrl+K", () => setOpen((open) => !open)],
  ]);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  const mainNavCommand = (item: MainNavItems): React.ReactNode => {
    if ("href" in item) {
      const { Icon } = item;
      return (
        <CommandItem
          onSelect={() => runCommand(() => router.push(item.href))}
          disabled={item.disabled}
        >
          {Icon ? (
            <Icon className="mr-2 h-4 w-4" />
          ) : (
            <Icons.Logo className="mr-2 h-4 w-4" />
          )}
          {item.title}
          {item.badge && (
            <BetaBadge className="ml-auto" variant={item.badge}>
              {item.badge}
            </BetaBadge>
          )}
        </CommandItem>
      );
    } else {
      return (
        <CommandGroup heading={item.title}>
          {mainNavCommand(item.primary)}
          {item.secondary.map((item) => (
            <React.Fragment key={item.href}>
              {mainNavCommand(item)}
            </React.Fragment>
          ))}
        </CommandGroup>
      );
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "relative w-full justify-start text-sm text-muted-foreground ",
          !noMaxWidth && "sm:w-[16rem]",
        )}
        onClick={() => setOpen(true)}
        {...props}
      >
        <span className="inline-flex">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {MAIN_NAV.map((item, index) => (
            <React.Fragment key={index}>{mainNavCommand(item)}</React.Fragment>
          ))}
          <CommandSeparator />
        </CommandList>
      </CommandDialog>
    </>
  );
}
