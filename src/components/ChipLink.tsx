import { ChevronRight } from "lucide-react";
import { Monogram } from "@/components/Monogram";

/** Tappable pill for a club or league ("⬤ AC Milan ›"). */
export function ChipLink({
  label,
  colors,
  href,
}: {
  label: string;
  colors: [string, string];
  href: string;
}) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 rounded-full bg-secondary py-1.5 pl-2 pr-3 text-xs font-medium text-foreground"
    >
      <Monogram
        text={label}
        colors={colors}
        className="h-4 w-4 rounded-full text-[7px]"
      />
      {label}
      <ChevronRight className="h-3 w-3 text-muted-foreground" />
    </a>
  );
}
