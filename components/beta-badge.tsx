import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";

interface BetaBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant: "Alpha" | "Beta" | "Coming Soon";
}

export function BetaBadge({ className, variant, ...props }: BetaBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full border-transparent border-none px-2 text-white/85",
        {
          "bg-fire-gradient": variant === "Alpha" || variant == "Beta",
          "bg-brand-gradient": variant === "Coming Soon",
        },
        className,
      )}
      {...props}
    >
      {variant}
    </Badge>
  );
}
