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
      "Size often shapes the overall feel of a community — from worship style to how easy it is to connect. This helps us suggest churches that match your comfort level.",
    required: true,
  },
  location: {
    label: "Location",
    description:
      "Location helps ensure recommendations are practical and easy to visit. We focus on churches in and around State College.",
    required: true,
  },
  additional: {
    label: "Additional information",
    description:
      "Share anything that matters to you right now (kids programs, accessibility needs, worship style, service opportunities, campus ministry, etc.).",
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
          <span className="text-sm font-semibold text-destructive">*</span>
        ) : (
          <span className="text-xs text-muted-foreground">Optional</span>
        )}
      </div>

      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border/60 bg-background text-muted-foreground shadow-sm transition-colors hover:bg-accent/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`Why we ask about ${help.label}`}
          >
            <Info className="h-4 w-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" align="end" className="max-w-sm">
          <div className="space-y-1">
            <div className="text-sm font-semibold text-foreground">Why this helps</div>
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

  const denominationId = useMemo(() => `denom-${crypto.randomUUID()}`, []);
  const sizeId = useMemo(() => `size-${crypto.randomUUID()}`, []);
  const locationId = useMemo(() => `loc-${crypto.randomUUID()}`, []);
  const additionalId = useMemo(() => `add-${crypto.randomUUID()}`, []);

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
        "We’re having trouble generating recommendations right now. Nothing was saved."
      );

      toast({
        title: "Matcher temporarily unavailable",
        description: "Please try again in a minute or browse churches instead.",
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
          <CardTitle className="text-xl">Find a church that fits you</CardTitle>
          <p className="text-sm text-muted-foreground">
            Answer a few short questions. You can tap the ⓘ icons to see why we ask each one.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {errorBanner && (
            <Alert variant="destructive">
              <AlertTitle>Something went wrong</AlertTitle>
              <AlertDescription>
                <p className="text-sm">{errorBanner}</p>
                <div className="mt-3 flex gap-2">
                  <Link to="/churches">
                    <Button variant="outline" size="sm">
                      Browse churches
                    </Button>
                  </Link>
                  <Button
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
            <div className="rounded-xl border border-border/60 bg-card/40 p-5">
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
                    className="resize-none"
                    placeholder="Anything else you’d like us to consider?"
                  />
                </div>
              </div>
            </div>

            <Button type="submit" disabled={isSearching} size="lg" className="w-full h-12">
              {isSearching ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Finding matches…
                </>
              ) : (
                <>
                  <Search className="mr-2 h-5 w-5" />
                  See recommendations
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default SearchForm;
