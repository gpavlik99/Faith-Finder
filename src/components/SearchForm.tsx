import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import * as Options from "@/lib/options";
import { supabase } from "@/integrations/client";

type Props = {
  onSearch: (params: any) => void;
  isSearching: boolean;
  setIsSearching: (searching: boolean) => void;
};

function FieldBlock(props: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="space-y-1">
        <div className="text-sm font-semibold">{props.title}</div>
        {props.description ? (
          <div className="text-sm text-muted-foreground">
            {props.description}
          </div>
        ) : null}
      </div>
      <div className="mt-3">{props.children}</div>
    </div>
  );
}

export default function SearchForm({ onSearch, isSearching, setIsSearching }: Props) {
  const NO_PREF = (Options as any).NO_PREFERENCE_VALUE ?? "no-preference";

  const WORSHIP_STYLES = Array.isArray((Options as any).WORSHIP_STYLES)
    ? (Options as any).WORSHIP_STYLES
    : [];

  const DISTANCE_OPTIONS_MILES = Array.isArray((Options as any).DISTANCE_OPTIONS_MILES)
    ? (Options as any).DISTANCE_OPTIONS_MILES
    : [];

  const PRIORITY_OPTIONS = Array.isArray((Options as any).PRIORITY_OPTIONS)
    ? (Options as any).PRIORITY_OPTIONS
    : [];

  const [denomination, setDenomination] = useState(NO_PREF);
  const [size, setSize] = useState("");
  const [worshipStyle, setWorshipStyle] = useState(NO_PREF);
  const [location, setLocation] = useState("Centre County");
  const [distance, setDistance] = useState(NO_PREF);
  const [priorities, setPriorities] = useState<string[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (location === "Centre County") {
      setDistance("25");
    } else if (distance === "25") {
      setDistance(NO_PREF);
    }
  }, [location, distance]);

  const isSubmitDisabled = useMemo(() => {
    return isSearching || !size || !location;
  }, [isSearching, size, location]);

  const togglePriority = (value: string) => {
    setPriorities((prev) =>
      prev.includes(value)
        ? prev.filter((p) => p !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = async () => {
    setError(null);
    setIsSearching(true);

    try {
      const { data: churches, error: churchError } = await supabase
        .from('churches')
        .select('*')
        .ilike('location', `%${location}%`);

      if (churchError) {
        throw new Error('Failed to load churches: ' + churchError.message);
      }

      if (!churches || churches.length === 0) {
        throw new Error(`No churches found for location "${location}". Try "Centre County" instead.`);
      }

      const { data: matchData, error: matchError } = await supabase.functions.invoke('match-church', {
        body: {
          denomination: denomination === NO_PREF ? "" : denomination,
          size,
          worshipStyle: worshipStyle === NO_PREF ? "" : worshipStyle,
          location,
          distance: distance === NO_PREF ? "" : distance,
          priorities,
          additionalInfo,
          churches,
        },
      });

      if (matchError) {
        throw new Error(matchError.message || 'Failed to get church matches');
      }

      if (!matchData) {
        throw new Error('No match data returned');
      }

      const bestMatchId = matchData.bestMatch?.churchId;
      const runnerUpIds = matchData.runnerUps?.map((r: any) => r.churchId) || [];

      if (!bestMatchId) {
        throw new Error('Invalid response: missing bestMatch');
      }

      const bestMatchChurch = churches.find(c => c.id === bestMatchId);
      const runnerUpChurches = runnerUpIds
        .map((id: string) => churches.find(c => c.id === id))
        .filter(Boolean);

      if (!bestMatchChurch) {
        throw new Error('Best match church not found in database');
      }

      const results = {
        bestMatch: {
          ...bestMatchChurch,
          reason: matchData.bestMatch.reason || 'This church matches your preferences.',
        },
        runnerUps: runnerUpChurches.map((church: any, idx: number) => ({
          ...church,
          reason: matchData.runnerUps[idx]?.reason || 'This is a good alternative option.',
        })),
      };

      onSearch(results);
    } catch (err: any) {
      console.error('Search error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <FieldBlock
        title="Denomination (optional)"
        description="Choose a tradition if it matters to you."
      >
        <Select value={denomination} onValueChange={setDenomination}>
          <SelectTrigger>
            <SelectValue placeholder="No preference" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NO_PREF}>No preference</SelectItem>
            <SelectItem value="Baptist">Baptist</SelectItem>
            <SelectItem value="Catholic">Catholic</SelectItem>
            <SelectItem value="Lutheran">Lutheran</SelectItem>
            <SelectItem value="Methodist">Methodist</SelectItem>
            <SelectItem value="Presbyterian">Presbyterian</SelectItem>
            <SelectItem value="Episcopal/Anglican">Episcopal / Anglican</SelectItem>
            <SelectItem value="Orthodox">Orthodox</SelectItem>
            <SelectItem value="Pentecostal/Charismatic">
              Pentecostal / Charismatic
            </SelectItem>
            <SelectItem value="Non-denominational">Non-denominational</SelectItem>
            <SelectItem value="Church of Christ">Church of Christ</SelectItem>
            <SelectItem value="Nazarene">Nazarene</SelectItem>
            <SelectItem value="Adventist">Seventh-day Adventist</SelectItem>
            <SelectItem value="Reformed">Reformed</SelectItem>
          </SelectContent>
        </Select>
      </FieldBlock>

      <FieldBlock
        title="Church size"
        description="Based on average weekly attendance."
      >
        <Select value={size} onValueChange={setSize}>
          <SelectTrigger>
            <SelectValue placeholder="Select a size range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Small (1–100 people)</SelectItem>
            <SelectItem value="medium">Medium (101–500 people)</SelectItem>
            <SelectItem value="large">Large (500+ people)</SelectItem>
          </SelectContent>
        </Select>
      </FieldBlock>

      <FieldBlock
        title="Worship style (optional)"
        description="Music, liturgy, and overall feel."
      >
        <Select value={worshipStyle} onValueChange={setWorshipStyle}>
          <SelectTrigger>
            <SelectValue placeholder="No preference" />
          </SelectTrigger>
          <SelectContent>
            {WORSHIP_STYLES.length === 0 ? (
              <SelectItem value={NO_PREF}>No preference</SelectItem>
            ) : (
              WORSHIP_STYLES.map((w: any) => (
                <SelectItem key={w.value} value={w.value}>
                  {w.label}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </FieldBlock>

      <FieldBlock title="Location" description="Where should we search?">
        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger>
            <SelectValue placeholder="Select a location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Centre County">Centre County, PA</SelectItem>
            <SelectItem value="State College">State College, PA</SelectItem>
            <SelectItem value="Bellefonte">Bellefonte, PA</SelectItem>
            <SelectItem value="Boalsburg">Boalsburg, PA</SelectItem>
            <SelectItem value="Penns Valley">Penns Valley, PA</SelectItem>
          </SelectContent>
        </Select>

        {location === "Centre County" && (
          <div className="mt-2 text-sm text-muted-foreground">
            We'll search across all of Centre County.
          </div>
        )}
      </FieldBlock>

      <FieldBlock
        title="Distance (optional)"
        description="How far are you willing to travel?"
      >
        <Select value={distance} onValueChange={setDistance}>
          <SelectTrigger>
            <SelectValue placeholder="No preference" />
          </SelectTrigger>
          <SelectContent>
            {DISTANCE_OPTIONS_MILES.length === 0 ? (
              <SelectItem value={NO_PREF}>No preference</SelectItem>
            ) : (
              DISTANCE_OPTIONS_MILES.map((d: any) => (
                <SelectItem key={d.value} value={d.value}>
                  {d.label}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        {location === "Centre County" && (
          <div className="mt-2 text-sm text-muted-foreground">
            Distance is set to <span className="font-medium">25 miles</span> for
            county-wide matching.
          </div>
        )}
      </FieldBlock>

      <FieldBlock
        title="Priorities (optional)"
        description="Pick what matters most to you (you can choose multiple)."
      >
        <div className="flex flex-wrap gap-2">
          {PRIORITY_OPTIONS.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              (Priorities options are unavailable right now.)
            </div>
          ) : (
            PRIORITY_OPTIONS.map((p: any) => {
              const selected = priorities.includes(p.value);
              return (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => togglePriority(p.value)}
                  className={[
                    "rounded-full border px-3 py-1 text-sm transition",
                    selected
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background hover:bg-muted",
                  ].join(" ")}
                  aria-pressed={selected}
                >
                  {p.label}
                </button>
              );
            })
          )}
        </div>
      </FieldBlock>

      <FieldBlock
        title="Anything else you want us to consider? (optional)"
        description="Childcare, accessibility, missions, music, teaching style, etc."
      >
        <Textarea
          placeholder="Tell us what matters to you…"
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          className="min-h-[110px]"
        />
      </FieldBlock>

      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
          className="w-full"
        >
          {isSearching && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSearching ? "Finding your match…" : "Find my match"}
        </Button>
        <div className="mt-2 text-center text-xs text-muted-foreground">
          We'll suggest one best match and two runner-ups.
        </div>
      </div>
    </div>
  );
}


