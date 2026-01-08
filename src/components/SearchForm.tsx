import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Info, Loader2, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { supabase } from "@/integrations/supabase/client";
import { useUserSettings } from "@/hooks/useUserSettings";
import { useToast } from "@/hooks/use-toast";
import type { MatchResults } from "@/types/match";

import { DENOMINATIONS, SIZES_REQUIRED, LOCATIONS } from "@/lib/options";

interface SearchFormProps {
  onSearch: (results: MatchResults) => void;
  isSearching: boolean;
  setIsSearching: (value: boolean) => void;
}

type FieldHelp = {
  label: string;
  description: string;
  required?: boolean;
};

const HELP_TEXT: Record<
  "denomination" | "size" | "location" | "additional",
  FieldHelp
> = {
  denomination: {
    label: "Denomination",
    description:
      "If you already identify with a tradition, this helps us prioritize churches that align with it. If you’re not sure, choose ‘No preference’ and we’ll focus on other signals.",
  },
  size: {
    label: "Church size",
    description:
      "Size often affects what the experience feels like — from the worship setting to how easy it is to meet people. We use this to find communities that match your comfort level.",
    required: true,
  },
  location: {
    label: "Location",
    description:
      "We focus on churches in and around State College. Location helps us recommend options that are realistically convenient so it’s easier to visit and stay connected.",
    required: true,
  },
  additional: {
    label: "Additional information",
    description:
      "Share anything that matters right now (kids programs, service opportunities, accessibility needs, campus ministry, worship style, etc.). This helps the recommendations feel more personal and specific.",
  },
};

function FieldLabel({ help, htmlFor }: { help: FieldHelp; htmlFor?: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
          {help.label}
        </Label>
        {help.required ? (
          <span
            className="text-sm font-semibold text-destructive"
            aria-hidden="true"
          >
            *
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">Optional</span>
        )}
      </div>

      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border/60 bg-background text-muted-foreground shadow-sm transition-colors hover:bg-accent/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`More info about ${help.label}`}
          >
            <Info className="h-4 w-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" align="end" className="max-w-sm">
          <div className="space-y-1">
            <div className="text-sm font-semibold text-foreground">Why we ask</div>
            <div className="text-sm text-muted-foreground">
              {help.description}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

const SearchForm = ({ onSearch, isSearching, setIsSearching }: SearchFormProps) => {
  const { settings } = useUserSettings();

  const [denomination_, setDenomination] = useState(
    settings.defaultDenomination || "No preference / Not sure"
  );
  const [size, setSize] = useState(settings.defaultSize || "");
  const [location, setLocation] = useState(settings.defaultLocation || "");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  const { toast } = useToast();

  // IDs help with accessibility + testing; Radix Select doesn't fully bind label->trigger,
  // but this keeps things consistent and future-proof.
  const denominationId = useMemo(
    () => `denomination-${Math.random().toString(36).slice(2)}`,
    []
  );
  const sizeId = useMemo(() => `size-${Math.random().toString(36).slice(2)}`, []);
  const locationId = useMemo(
    () => `location-${Math.random().toString(36).slice(2)}`,
    []
  );
  const additionalId = useMemo(
    () => `additional-${Math.random().toString(36).slice(2)}`,
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!size || !location) {
      toast({
        title: "Missing information",
        description: "Please select a church size and location.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setErrorBanner(null);

    try {
      const { data: churches, error: churchError } = await supabase
        .from("churches")
        .select("*");

      if (churchError) throw churchError;

      const { data: matchData, error: matchError } =
        await supabase.functions.invoke("match-church", {
          body: {
            denomination: denomination_,
            size,
            location,
            additionalInfo,
            churches,
          },
        });

      if (matchError) throw matchError;

      const bestMatch = churches?.find(
        (c) => c.id === matchData.bestMatch.churchId
      );

      const runnerUps = matchData.runnerUps
        .map((ru: any) => churches?.find((c) => c.id === ru.churchId))
        .filter(Boolean);

      if (bestMatch) {
        onSearch({
          bestMatch: {
            ...bestMatch,
            reason: matchData.bestMatch.reason,
          },
          runnerUps: runnerUps.map((church: any, idx: number) => ({
            ...church,
            reason: matchData.runnerUps[idx]?.reason || "",
          })),
        });
      }
    } catch (error: any) {
      console.error("Search error:", error);

      setErrorBanner(
        "Our church matcher is having trouble right now. Nothing was saved. Please try again in a minute — or browse churches instead."
      );

      toast({
        title: "We couldn’t generate matches right now",
        description: "The AI matcher is temporarily unavailable. Please try again soon.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <TooltipProvider>
      <Card className="border-border/60 shadow-card">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl">Answer a few quick questions</CardTitle>
          <p className="text-sm text-muted-foreground">
            We’ll use these details to generate explainable church recommendations.
            Required fields are marked with *.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {errorBanner && (
            <Alert variant="destructive">
              <AlertTitle>We couldn’t generate matches right now</AlertTitle>
              <AlertDescription>
                <p className="text-sm">{errorBanner}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link to="/churches">
                    <Button type="button" variant="outline" size="sm">
                      Browse churches
                    </Button>
                  </Link>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setErrorBanner(null)}
                  >
                    Dismiss
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-xl border border-border/60 bg-card/40 p-4 md:p-5">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <FieldLabel help={HELP_TEXT.denomination} htmlFor={denominationId} />
                  <Select value={denomination_} onValueChange={setDenomination}>
                    <SelectTrigger id={denominationId} className="h-11">
                      <SelectValue placeholder="No preference / Not sure" />
                    </SelectTrigger>
                    <SelectContent>
                      {DENOMINATIONS.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <FieldLabel help={HELP_TEXT.size} htmlFor={sizeId} />
                  <Select value={size} onValueChange={setSize}>
                    <SelectTrigger id={sizeId} className="h-11">
                      <SelectValue placeholder="Select church size" />
                    </SelectTrigger>
                    <SelectContent>
                      {SIZES_REQUIRED.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <FieldLabel help={HELP_TEXT.location} htmlFor={locationId} />
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger id={locationId} className="h-11">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {LOCATIONS.map((l) => (
                        <SelectItem key={l} value={l}>
                          {l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <FieldLabel help={HELP_TEXT.additional} htmlFor={additionalId} />
                  <Textarea
                    id={additionalId}
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    rows={4}
                    placeholder="Anything you want the matcher to know?"
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Tip: Add specifics like “welcoming to newcomers,” “strong kids ministry,”
                    “service opportunities,” or “more traditional worship.”
                  </p>
                </div>
              </div>
            </div>

            <Button type="submit" disabled={isSearching} size="lg" className="w-full h-12">
              {isSearching ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Searching…
                </>
              ) : (
                <>
                  <Search className="mr-2 h-5 w-5" />
                  Find My Church
                </>
              )}
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span>Prefer to explore on your own?</span>
              <Link to="/churches" className="text-primary hover:underline">
                Browse all churches
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default SearchForm;
