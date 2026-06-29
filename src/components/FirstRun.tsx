import { ProfileForm } from "@/components/ProfileForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Profile } from "@/types";

interface FirstRunProps {
  onSave: (profile: Profile) => void;
}

/** First-run screen — collects name + favorite team before the app opens. */
export function FirstRun({ onSave }: FirstRunProps) {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10">
      <div className="mb-6 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
          2026 · Watching Companion
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight">
          Set up your seat
        </h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-xl">
            Who's watching?
          </CardTitle>
          <CardDescription>
            We'll save this on your device so the app opens to your team. You
            can change it anytime in Settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm submitLabel="Start watching" onSave={onSave} />
        </CardContent>
      </Card>
    </div>
  );
}
