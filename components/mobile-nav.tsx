"use client";

import * as React from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { ScrollArea } from "./ui/scroll-area";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MAIN_NAV, MainNavItems } from "@/lib/nav";
import * as Icons from "./icons";
import { BetaBadge } from "./beta-badge";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className=" px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Icons.Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pt-0 w-full">
        <div className="flex flex-col h-full">
          <div className="flex h-[60px] justify-between items-center pl-2 pr-6">
            <MobileLink
              href="/"
              className="flex items-center space-x-2"
              onOpenChange={setOpen}
            >
              <Icons.Logo className="h-6 w-6" />
              <span className="font-bold inline-block">v19</span>
            </MobileLink>
          </div>
          <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-0 pl-3">
            <div className="flex flex-col space-y-3">
              {MAIN_NAV.map((item, index) => (
                <MobileNavItem key={index} item={item} setOpen={setOpen} />
              ))}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}

interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  disabled,
  ...props
}: MobileLinkProps) {
  if (disabled) {
    return (
      <a className={cn(className)} {...props}>
        {children}
      </a>
    );
  }
  const router = useRouter();

  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString());
        onOpenChange?.(false);
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Link>
  );
}

function MobileNavItem({
  item,
  setOpen,
}: {
  item: MainNavItems;
  setOpen: (open: boolean) => void;
}) {
  if ("href" in item) {
    return (
      <MobileLink key={item.href} href={item.href} onOpenChange={setOpen}>
        {item.title} {item.badge && <BetaBadge variant={item.badge} />}
      </MobileLink>
    );
  } else {
    return (
      <div className="flex flex-col space-y-2 pt-2">
        <h4 className="font-medium">{item.title}</h4>
        <MobileLink
          href={item.primary.href}
          key={item.primary.href}
          onOpenChange={setOpen}
          disabled={item.primary.disabled}
          className="text-muted-foreground flex items-center justify-between"
        >
          {item.primary.title}{" "}
          {item.primary.badge && <BetaBadge variant={item.primary.badge} />}
        </MobileLink>
        {item.secondary.map((item) => (
          <MobileLink
            href={item.href}
            key={item.href}
            onOpenChange={setOpen}
            disabled={item.disabled}
            className="text-muted-foreground flex items-center justify-between"
          >
            {item.title} {item.badge && <BetaBadge variant={item.badge} />}
          </MobileLink>
        ))}
      </div>
    );
  }
}
