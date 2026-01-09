import { useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Sparkles, TriangleAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DENOMINATIONS, SIZES_OPTIONAL, LOCATIONS } from "@/lib/options";
import { useUserSettings } from "@/hooks/useUserSettings";
import type { MatchResults } from "@/types/match";

type Props = {
  onSearch: (results: MatchResults) => void;
  isSearching: boolean;
  setIsSearching: (next: boolean) => void;
};

type AiMatchResponse = {
  bestMatch: { churchId: string; reason?: string };
  runnerUps: Array<{ churchId: string; reason?: string }>;
};

const NO_PREFERENCE = "__no_preference__";

export default function SearchForm({ onSearch, isSearching, setIsSearching }: Props) {
  const { settings } = useUserSettings();

  const [denomination, setDenomination] = useState<string>(
    settings.defaultDenomination ?? "No preference / Not sure"
  );
  const [size, setSize] = useState<string>(settings.defaultSize ?? "");
  const [location, setLocation] = useState<string>(settings.defaultLocation ?? "State College");
  const [additionalInfo, setAdditionalInfo] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const sizeSelectValue = useMemo(() => (size === "" ? NO_PREFERENCE : size), [size]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSearching(true);

    try {
      // 1) Load churches from Supabase
      const { data: churches, error: churchesError } = await supabase
        .from("churches")
        .select("*");

      if (churchesError) {
        throw new Error(churchesError.message || "Failed to load churches");
      }
      if (!churches || churches.length === 0) {
        throw new Error(
          "No churches found in the database yet. Add some churches (Admin → Churches) and try again."
        );
      }

      // 2) Call the Edge Function that asks the AI for a match
      const { data: aiData, error: fnError } = await supabase.functions.invoke<AiMatchResponse>(
        "match-church",
        {
          body: {
            denomination: denomination === "No preference / Not sure" ? "" : denomination,
            size,
            location,
            additionalInfo: additionalInfo.trim() ? additionalInfo.trim() : "",
            churches,
          },
        }
      );

      if (fnError) {
        // fnError can be vague; keep it user-friendly.
        throw new Error(
          fnError.message ||
            "Matching service failed. Confirm the Supabase Edge Function 'match-church' is deployed and has OPENAI_API_KEY set."
        );
      }

      if (!aiData?.bestMatch?.churchId) {
        throw new Error(
          "The matcher returned an unexpected response. Try again, or check the Edge Function logs in Supabase."
        );
      }

      // 3) Join AI picks back to full church rows
      const byId = new Map(churches.map((c) => [c.id, c]));
      const bestRow = byId.get(aiData.bestMatch.churchId);

      if (!bestRow) {
        throw new Error(
          "The matcher selected a church that wasn't found in the loaded list. Please try again."
        );
      }

      const runnerRows = (aiData.runnerUps ?? [])
        .map((r) => {
          const row = byId.get(r.churchId);
          return row
            ? {
                ...row,
                reason: r.reason,
              }
            : null;
        })
        .filter(Boolean) as any[];

      const results: MatchResults = {
        bestMatch: {
          ...bestRow,
          // Normalize nullable fields to keep UI stable
          description: bestRow.description ?? "",
          latitude: bestRow.latitude ?? undefined,
          longitude: bestRow.longitude ?? undefined,
          reason: aiData.bestMatch.reason,
        } as any,
        runnerUps: runnerRows.map((row) =>
          ({
            ...row,
            description: row.description ?? "",
            latitude: row.latitude ?? undefined,
            longitude: row.longitude ?? undefined,
          } as any)
        ),
      };

      onSearch(results);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <Card className="shadow-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          Tell us what you’re looking for
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <Alert variant="destructive" className="mb-6">
            <TriangleAlert className="h-4 w-4" />
            <AlertTitle>Couldn’t run the match</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Denomination</Label>
              <Select value={denomination} onValueChange={setDenomination}>
                <SelectTrigger>
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
              <Label>Church size</Label>
              <Select
                value={sizeSelectValue}
                onValueChange={(v) => setSize(v === NO_PREFERENCE ? "" : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="No preference" />
                </SelectTrigger>
                <SelectContent>
                  {SIZES_OPTIONAL.map((s) => {
                    const value = s.value === "" ? NO_PREFERENCE : s.value;
                    return (
                      <SelectItem key={value} value={value}>
                        {s.label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="State College" />
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
          </div>

          <div className="space-y-2">
            <Label>Anything else you want us to consider? (optional)</Label>
            <Textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Example: good kids program, contemporary music, small groups, wheelchair accessible…"
              className="min-h-[110px]"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSearching}>
            {isSearching ? "Finding your best match…" : "Find my church"}
          </Button>

          <p className="text-xs text-muted-foreground">
            If matching fails in production, verify your Supabase Edge Function <code>match-church</code> is deployed
            and has <code>OPENAI_API_KEY</code> configured in Supabase.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
