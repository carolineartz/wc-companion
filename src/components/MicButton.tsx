import { Mic } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useVoice } from "@/hooks/useVoice";
import { parseJerseyNumber } from "@/lib/numbers";
import { resolvePlayer } from "@/lib/resolvePlayer";
import type { Player } from "@/types";

interface MicButtonProps {
  teamId: string;
  onResolve: (player: Player) => void;
}

/**
 * Mic control for the voice flow. Captures one utterance, extracts a jersey
 * number ("number ten" -> 10), resolves the player, and opens their kit card.
 * Hidden entirely when SpeechRecognition is unavailable.
 */
export function MicButton({ teamId, onResolve }: MicButtonProps) {
  const { supported, listening, listen } = useVoice();
  const [status, setStatus] = useState<string | null>(null);

  if (!supported) return null;

  const handleClick = () => {
    setStatus(null);
    listen((transcript) => {
      const number = parseJerseyNumber(transcript);
      if (number === null) {
        setStatus(`Didn't catch a number in "${transcript}".`);
        return;
      }
      const player = resolvePlayer(teamId, number);
      if (!player) {
        setStatus(`No #${number} on this squad.`);
        return;
      }
      setStatus(null);
      onResolve(player);
    });
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        type="button"
        variant={listening ? "default" : "outline"}
        size="icon"
        aria-label={listening ? "Listening…" : "Ask by voice"}
        onClick={handleClick}
        className={listening ? "animate-pulse" : ""}
      >
        <Mic className={listening ? "text-primary-foreground" : "opacity-80"} />
      </Button>
      {status && (
        <span className="max-w-[12rem] text-right font-mono text-[11px] text-muted-foreground">
          {status}
        </span>
      )}
    </div>
  );
}
