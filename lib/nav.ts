import * as Icons from "@/components/icons";
import { Icon } from "@tabler/icons-react";

interface MainNavItem {
  title: string;
  href: string;
  description: string;
  Icon?: Icon;
  disabled?: boolean;
  badge?: "Alpha" | "Beta" | "Coming Soon";
}

interface MainNavGroup {
  title: string;
  primary: MainNavItem;
  secondary: MainNavItem[];
}

export type MainNavItems = Omit<MainNavItem, "description"> | MainNavGroup;

export const MAIN_NAV: MainNavItems[] = [
  {
    title: "Products",
    primary: {
      title: "Kanri",
      href: "https://kanrimemberships.com",
      description:
        "Streamlined membership management for karate schools, yoga studios, music academies, and more.",
      Icon: Icons.Kanri,
      badge: "Alpha",
    },
    secondary: [
      {
        title: "Vault",
        href: "https://vault.v19.io",
        description: "Your secure password manager and digital vault.",
        Icon: Icons.Vault,
        disabled: true,
        badge: "Coming Soon",
      },
      {
        title: "Buck",
        href: "https://buck.v19.io",
        description:
          "Simple, secure, and fast file sharing for the modern web.",
        Icon: Icons.Buck,
        disabled: true,
        badge: "Coming Soon",
      },
      {
        title: "Shrt",
        href: "https://shrt.v19.io",
        description:
          "Flexible, secure, and fast URL shortening for the modern web.",
        Icon: Icons.Shrt,
        disabled: true,
        badge: "Coming Soon",
      },
      {
        title: "Pass",
        href: "https://pass.v19.io",
        description:
          "A flexible and secure OAuth/SAML/SSO provider that offers enhanced functionality like user group creation and custom domain management.",
        Icon: Icons.Pass,
        disabled: true,
        badge: "Coming Soon",
      },
      {
        title: "Char",
        href: "https://char.v19.io",
        description:
          "A highly customizable character, encounter, and campaign manager for role-playing games.",
        Icon: Icons.Char,
        disabled: true,
        badge: "Coming Soon",
      },
      {
        title: "Tock",
        href: "https://tock.v19.io",
        description:
          "Your time toolbox. Shared timers, stopwatches, alarms, countdowns, and more.",
        Icon: Icons.Tock,
        disabled: true,
        badge: "Coming Soon",
      },
    ],
  },
  // {
  //   title: "About",
  //   primary: {
  //     title: "About",
  //     href: "/about",
  //     description: "Learn more about us and our mission.",
  //   },
  //   secondary: [
  //     {
  //       title: "Team",
  //       href: "/about/team",
  //       description: "Meet the team behind the products.",
  //     },
  //     {
  //       title: "Careers",
  //       href: "/about/careers",
  //       description: "Join our team and help us build the future.",
  //     },
  //     {
  //       title: "Contact",
  //       href: "/about/contact",
  //       description: "Get in touch with us.",
  //     },
  //   ],
  // },
];
