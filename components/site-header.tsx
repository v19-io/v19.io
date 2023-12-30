import { MainNav } from "./main-nav";
import { CommandMenu } from "./command-menu";
import { MobileNav } from "./mobile-nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="lg:container flex h-14 items-center gap-4 px-3">
        <MainNav />
        <div className="flex w-full sm:w-min sm:ml-auto">
          <CommandMenu />
        </div>
        <MobileNav />
      </div>
    </header>
  );
}
