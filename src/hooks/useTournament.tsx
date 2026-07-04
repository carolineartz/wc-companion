import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { MatchDetails } from "@/lib/live/normalize";
import {
  type DataSource,
  loadCache,
  type TournamentSnapshot,
} from "@/lib/source";
import type { Match } from "@/types";

const POLL_MS = 60_000;

interface TournamentState {
  kind: DataSource["kind"];
  now: () => Date;
  matches: Match[];
  groups: TournamentSnapshot["groups"];
  boot: TournamentSnapshot["boot"];
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
  refresh: () => void;
  matchDetails: DataSource["matchDetails"];
}

const Ctx = createContext<TournamentState | null>(null);

export function TournamentProvider({
  source,
  children,
}: {
  source: DataSource;
  children: ReactNode;
}) {
  const [snapshot, setSnapshot] = useState<TournamentSnapshot | null>(() =>
    source.kind === "live" ? loadCache() : null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const inFlight = useRef(false);

  const refresh = useCallback(() => {
    if (inFlight.current) return;
    inFlight.current = true;
    setLoading(true);
    source
      .load()
      .then((s) => {
        setSnapshot(s);
        setError(null);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        inFlight.current = false;
        setLoading(false);
      });
  }, [source]);

  // Initial load + a steady poll while the tab is visible (live only).
  useEffect(() => {
    refresh();
    if (source.kind !== "live") return;
    const tick = () => {
      if (document.visibilityState === "visible") refresh();
    };
    const interval = setInterval(tick, POLL_MS);
    document.addEventListener("visibilitychange", tick);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [refresh, source.kind]);

  return (
    <Ctx.Provider
      value={{
        kind: source.kind,
        now: source.now,
        matches: snapshot?.matches ?? [],
        groups: snapshot?.groups ?? [],
        boot: snapshot?.boot ?? null,
        loading,
        error,
        lastUpdated: snapshot?.fetchedAt ?? null,
        refresh,
        matchDetails: source.matchDetails,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useTournament(): TournamentState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTournament outside TournamentProvider");
  return ctx;
}

/** Per-match extras (boxscore stats, lineups), refreshed while live. */
export function useMatchDetails(match: Match | undefined): MatchDetails | null {
  const { matchDetails } = useTournament();
  const [details, setDetails] = useState<MatchDetails | null>(null);
  const id = match?.id;
  const active = match?.status === "live";

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    const fetchOnce = () => {
      matchDetails(id)
        .then((d) => {
          if (!cancelled && d) setDetails(d);
        })
        .catch(() => {
          // detail sections just stay hidden
        });
    };
    fetchOnce();
    const interval = active ? setInterval(fetchOnce, 45_000) : undefined;
    return () => {
      cancelled = true;
      if (interval) clearInterval(interval);
    };
  }, [id, active, matchDetails]);

  return details;
}
