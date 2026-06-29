import type { Profile } from "@/types";
import { ProfileForm } from "@/components/ProfileForm";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface SettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: Profile;
  onSave: (profile: Profile) => void;
  onReset: () => void;
}

/** Edit the saved profile, or reset it entirely. */
export function Settings({
  open,
  onOpenChange,
  profile,
  onSave,
  onReset,
}: SettingsProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader className="pr-8">
          <SheetTitle className="font-display text-xl">Settings</SheetTitle>
          <SheetDescription>
            Update your name or the team(s) you follow.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-8">
          <ProfileForm
            initial={profile}
            submitLabel="Save changes"
            onSave={(p) => {
              onSave(p);
              onOpenChange(false);
            }}
          />
          <div className="border-t border-border pt-6">
            <Button
              type="button"
              variant="outline"
              className="w-full text-destructive hover:text-destructive"
              onClick={onReset}
            >
              Reset profile
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
