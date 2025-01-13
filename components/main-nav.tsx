"use client";

import * as React from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { cn } from "@/lib/utils";
import { MAIN_NAV, MainNavItems } from "@/lib/nav";
import * as Icons from "./icons";
import { BetaBadge } from "./beta-badge";

export function MainNav() {
  return (
    <>
      <Link href="/" className="flex items-center gap-x-2">
        <Icons.Logo className="h-6 w-6" />
        <span className="font-bold inline-block">v19</span>
      </Link>
      <div className="absolute hidden md:flex w-full items-center justify-center">
        <NavigationMenu>
          <NavigationMenuList>
            {MAIN_NAV.map((item) => (
              <MainNavItem item={item} key={item.title} />
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </>
  );
}

const MainNavItem = ({ item }: { item: MainNavItems }) => {
  if ("href" in item) {
    return (
      <NavigationMenuItem>
        <Link href={item.href} legacyBehavior passHref>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            {item.title}
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>
    );
  } else {
    const { Icon } = item.primary;
    return (
      <NavigationMenuItem>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul
            className={cn(
              "grid gap-3 p-4 md:w-[600px] md:grid-cols-[.75fr_1fr_1fr]",
              {
                "md:grid-cols-[.75fr_1fr]":
                  item.secondary.length > 0 && item.secondary.length <= 3,
                "md:grid-cols-[.75fr_1fr_1fr]":
                  item.secondary.length > 3 && item.secondary.length <= 6,
                "md:grid-cols-[.75fr_1fr_1fr_1fr]": item.secondary.length > 6,
              },
            )}
          >
            <li className="row-span-3">
              <NavigationMenuLink asChild>
                <a
                  className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                  href={item.primary.disabled ? undefined : item.primary.href}
                >
                  <div className="flex items-center justify-between">
                    {Icon ? (
                      <Icon className="h-6 w-6" />
                    ) : (
                      <Icons.Logo className="h-6 w-6" />
                    )}
                    {item.primary.badge && (
                      <BetaBadge variant={item.primary.badge} />
                    )}
                  </div>
                  <div className="mb-2 mt-4 text-lg font-medium flex items-center justify-between">
                    {item.primary.title}
                  </div>
                  <p className="text-sm leading-tight text-muted-foreground">
                    {item.primary.description}
                  </p>
                </a>
              </NavigationMenuLink>
            </li>
            {item.secondary.map((item) => (
              <ListItem
                href={item.href}
                title={item.title}
                key={item.title}
                disabled={item.disabled}
                badge={item.badge}
              >
                {item.description}
              </ListItem>
            ))}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & {
    disabled?: boolean;
    badge?: "Alpha" | "Beta" | "Coming Soon";
  }
>(({ className, title, children, disabled, badge, ...props }, ref) => {
  if (disabled) {
    props.href = undefined;
  }
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none flex justify-between items-center">
            {title}
            {badge && <BetaBadge variant={badge} />}
          </div>
          <p className="line-clamp-3 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
