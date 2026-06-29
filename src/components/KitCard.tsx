import { ChevronRight, Volume2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { getTeamColors } from "@/data/teamColors";
import { useVoice } from "@/hooks/useVoice";
import { fetchBriefing, fetchTopicSummary } from "@/lib/companion";
import type { CompanionResponse, Player, Profile, Team } from "@/types";

interface KitCardProps {
  team: Team;
  player: Player;
  profile: Profile;
}

/**
 * THE KIT CARD — the app's signature surface. Rendered inside a Sheet.
 *
 *   header  : flag + national team + position (mono)
 *   shirt   : nameset (display caps) over a big kit number, in team kit colors
 *   chips   : tappable CLUB (color dot) + LEAGUE chips -> open a summary sheet
 *   briefing: live paragraph from the companion (sans)
 */
export function KitCard({ team, player, profile }: KitCardProps) {
  const kit = useMemo(() => getTeamColors(team.id), [team.id]);
  const { canSpeak, speak } = useVoice();

  const [data, setData] = useState<CompanionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [topic, setTopic] = useState<{
    kind: "club" | "league";
    subject: string;
  } | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setData(null);
    fetchBriefing(team, player, profile).then((res) => {
      if (active) {
        setData(res);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [team, player, profile]);

  const clubColor = data?.clubColors[0] ?? "#C9CFC4";
  const position = data?.position ?? player.position;

  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* Header */}
      <SheetHeader className="pr-8">
        <SheetTitle className="flex items-center gap-2 font-display text-xl tracking-wide">
          <span aria-hidden className="text-2xl">
            {team.flag}
          </span>
          <span>{team.name}</span>
        </SheetTitle>
        <SheetDescription className="font-mono uppercase tracking-[0.2em]">
          {position}
        </SheetDescription>
      </SheetHeader>

      {/* Shirt block — national kit colors */}
      <div
        className="relative flex flex-col items-center justify-center rounded-xl border border-border px-6 py-10"
        style={{
          background: `linear-gradient(160deg, ${kit.shirt}, ${
            kit.shirtTo ?? kit.shirt
          })`,
          color: kit.text,
        }}
      >
        <div className="text-center font-display text-2xl font-semibold uppercase leading-tight tracking-[0.18em]">
          {player.name}
        </div>
        <div
          className="mt-2 font-display text-[7rem] font-bold leading-none"
          style={{ color: kit.number }}
        >
          {player.number}
        </div>
      </div>

      {/* Club + League chips */}
      <div className="flex flex-wrap gap-2">
        {loading ? (
          <>
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-32" />
          </>
        ) : (
          <>
            <Chip
              label={data?.club ?? "—"}
              dotColor={clubColor}
              onClick={() =>
                data && setTopic({ kind: "club", subject: data.club })
              }
            />
            <Chip
              label={data?.league ?? "—"}
              onClick={() =>
                data && setTopic({ kind: "league", subject: data.league })
              }
            />
          </>
        )}
      </div>

      {/* Briefing */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Briefing
          </h3>
          {canSpeak && data && !loading && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Read briefing aloud"
              onClick={() => speak(data.briefing)}
            >
              <Volume2 />
            </Button>
          )}
        </div>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[92%]" />
            <Skeleton className="h-4 w-[80%]" />
          </div>
        ) : (
          <p className="font-sans text-sm leading-relaxed text-foreground/90">
            {data?.briefing}
          </p>
        )}
      </div>

      {/* Nested club/league summary sheet */}
      <Sheet open={!!topic} onOpenChange={(open) => !open && setTopic(null)}>
        <SheetContent side="bottom" className="max-h-[70vh]">
          {topic && (
            <TopicSummary
              kind={topic.kind}
              subject={topic.subject}
              teamName={team.name}
              playerName={player.name}
              profile={profile}
              accent={topic.kind === "club" ? clubColor : kit.accent}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Chip({
  label,
  dotColor,
  onClick,
}: {
  label: string;
  dotColor?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm text-card-foreground transition-colors hover:bg-card/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {dotColor && (
        <span
          aria-hidden
          className="h-2.5 w-2.5 shrink-0 rounded-full ring-1 ring-black/20"
          style={{ backgroundColor: dotColor }}
        />
      )}
      <span className="font-mono">{label}</span>
      <ChevronRight className="h-4 w-4 opacity-60" />
    </button>
  );
}

function TopicSummary({
  kind,
  subject,
  teamName,
  playerName,
  profile,
  accent,
}: {
  kind: "club" | "league";
  subject: string;
  teamName: string;
  playerName: string;
  profile: Profile;
  accent: string;
}) {
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setText(null);
    fetchTopicSummary(kind, subject, { teamName, playerName, profile }).then(
      (res) => {
        if (active) setText(res);
      },
    );
    return () => {
      active = false;
    };
  }, [kind, subject, teamName, playerName, profile]);

  return (
    <div className="flex flex-col gap-4 pb-6">
      <SheetHeader className="pr-8">
        <SheetDescription
          className="font-mono text-xs uppercase tracking-[0.2em]"
          style={{ color: accent }}
        >
          {kind}
        </SheetDescription>
        <SheetTitle className="font-display text-lg tracking-wide">
          {subject}
        </SheetTitle>
      </SheetHeader>
      {text === null ? (
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[88%]" />
          <Skeleton className="h-4 w-[70%]" />
        </div>
      ) : (
        <p className="font-sans text-sm leading-relaxed text-foreground/90">
          {text}
        </p>
      )}
    </div>
  );
}
