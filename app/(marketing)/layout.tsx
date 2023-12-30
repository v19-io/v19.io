import { SiteHeader } from "@/components/site-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex max-h-screen flex-col">
      <SiteHeader />
      <ScrollArea className={cn("flex flex-col h-full")}>
        <div className="flex-1">{children}</div>
      </ScrollArea>
    </div>
  );
}
