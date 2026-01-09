import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  MapPin,
  Ruler,
  Church,
  Music,
  ListChecks,
  MessageSquareText,
  Landmark,
} from "lucide-react";
import {
  CHURCH_SIZES,
  WORSHIP_STYLES,
  DISTANCE_OPTIONS_MILES,
  PRIORITY_OPTIONS,
  NO_PREFERENCE_VALUE,
} from "@/lib/options";

type Props = {
  onSearch: (params: any) => void;
  isSearching: boolean;
};

const PREFS_KEY = "faith_finder_match_prefs_v1";

type SavedPrefs = {
  denomination: string;
  size: string;
  worshipStyle: string;
  location: string;
  distance: string;
  priorities: string[];
  additionalInfo: string;
  saveEnabled: boolean;
};

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export default function SearchForm({ onSearch, isSearching }: Props) {
  const [saveEnabled, setSaveEnabled] = useState(false);

  const [denomination, setDenomination] = useState(NO_PREFERENCE_VALUE);
  const [size, setSize] = useState("");
  const [worshipStyle, setWorshipStyle] = useState(NO_PREFERENCE_VALUE);
  const [location, setLocation] = useState("Centre County");
  const [distance, setDistance] = useState(NO_PREFERENCE_VALUE);
  const [priorities, setPriorities] = useState<string[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState("");

  // Optional sections collapsed by default; required sections open by default
  const [openSections, setOpenSections] = useState<string[]>([
    "church-size",
    "location",
  ]);

  // Load saved prefs on mount
  useEffect(() => {
    const saved = safeParse<SavedPrefs>(localStorage.getItem(PREFS_KEY));
    if (!saved) return;

    setSaveEnabled(Boolean(saved.saveEnabled));
    setDenomination(saved.denomination ?? NO_PREFERENCE_VALUE);
    setSize(saved.size ?? "");
    setWorshipStyle(saved.worshipStyle ?? NO_PREFERENCE_VALUE);
    setLocation(saved.location ?? "Centre County");
    setDistance(saved.distance ?? NO_PREFERENCE_VALUE);
    setPriorities(Array.isArray(saved.priorities) ? saved.priorities : []);
    setAdditionalInfo(saved.additionalInfo ?? "");
  }, []);

  // Auto-set distance to 25 miles when Centre County is chosen
  useEffect(() => {
    if (location === "Centre County") {
      setDistance("25");
    } else {
      if (distance === "25") setDistance(NO_PREFERENCE_VALUE);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  // Save prefs whenever they change (only when toggle is enabled)
  useEffect(() => {
    if (!saveEnabled) return;

    const payload: SavedPrefs = {
      denomination,
      size,
      worshipStyle,
      location,
      distance,
      priorities,
      additionalInfo,
      saveEnabled,
    };

    localStorage.setItem(PREFS_KEY, JSON.stringify(payload));
  }, [
    saveEnabled,
    denomination,
    size,
    worshipStyle,
    location,
    distance,
    priorities,
    additionalInfo,
  ]);

  const isSubmitDisabled = useMemo(() => {
    return isSearching || !size || !location;
  }, [isSearching, size, location]);

  const togglePriority = (value: string) => {
    setPriorities((prev) =>
      prev.includes(value) ? prev.filter((p) => p !== value) : [...prev, value],
    );
  };

  const handleReset = () => {
    setDenomination(NO_PREFERENCE_VALUE);
    setSize("");
    setWorshipStyle(NO_PREFERENCE_VALUE);
    setLocation("Centre County");
    setDistance(NO_PREFERENCE_VALUE);
    setPriorities([]);
    setAdditionalInfo("");
    setOpenSections(["church-size", "location"]);

    localStorage.removeItem(PREFS_KEY);
  };

  const handleSaveToggle = (checked: boolean) => {
    setSaveEnabled(checked);
    if (!checked) {
      localStorage.removeItem(PREFS_KEY);
    }
  };

  const handleSubmit = () => {
    onSearch({
      denomination: denomination === NO_PREFERENCE_VALUE ? "" : denomination,
      size,
      worshipStyle: worshipStyle === NO_PREFERENCE_VALUE ? "" : worshipStyle,
      location,
      distance: distance === NO_PREFERENCE_VALUE ? "" : distance,
      priorities,
      additionalInfo,
    });
  };

  return (
    <div className="space-y-4">
      {/* Header actions */}
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="text-sm font-semibold">Match preferences</div>
            <div className="text-sm text-muted-foreground">
              Optional sections are collapsed by default — expand only what you
              care about.
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <Switch checked={saveEnabled} onCheckedChange={handleSaveToggle} />
              <span className="text-sm">Save these preferences</span>
            </div>
            <Button type="button" variant="outline" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Accordion */}
      <Accordion
        type="multiple"
        value={openSections}
        onValueChange={setOpenSections}
        className="space-y-3"
      >
        {/* Required: Church Size */}
        <AccordionItem value="church-size" className="rounded-xl border bg-card shadow-sm">
          <AccordionTrigger className="px-4 py-3">
            <div className="flex items-center gap-3">
              <Church className="h-4 w-4" />
              <div className="text-left">
                <div className="text-sm font-semibold">Church size</div>
                <div className="text-sm text-muted-foreground">
                  Required — pick the community size you’ll feel comfortable in.
                </div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <Select value={size} onValueChange={setSize}>
              <SelectTrigger>
                <SelectValue placeholder="Select a size" />
              </SelectTrigger>
              <SelectContent>
                {CHURCH_SIZES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>

        {/* Required: Location */}
        <AccordionItem value="location" className="rounded-xl border bg-card shadow-sm">
          <AccordionTrigger className="px-4 py-3">
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4" />
              <div className="text-left">
                <div className="text-sm font-semibold">Location</div>
                <div className="text-sm text-muted-foreground">
                  Required — where should we search?
                </div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
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

            {location === "Centre County" ? (
              <div className="mt-2 text-sm text-muted-foreground">
                We’ll search across all of Centre County.
              </div>
            ) : null}
          </AccordionContent>
        </AccordionItem>

        {/* Optional: Denomination */}
        <AccordionItem value="denomination" className="rounded-xl border bg-card shadow-sm">
          <AccordionTrigger className="px-4 py-3">
            <div className="flex items-center gap-3">
              <Landmark className="h-4 w-4" />
              <div className="text-left">
                <div className="text-sm font-semibold">Denomination (optional)</div>
                <div className="text-sm text-muted-foreground">
                  Choose a tradition if it matters to you.
                </div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <Select value={denomination} onValueChange={setDenomination}>
              <SelectTrigger>
                <SelectValue placeholder="No preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_PREFERENCE_VALUE}>No preference</SelectItem>
                <SelectItem value="Catholic">Catholic</SelectItem>
                <SelectItem value="Protestant">Protestant</SelectItem>
                <SelectItem value="Non-denominational">Non-denominational</SelectItem>
                <SelectItem value="Orthodox">Orthodox</SelectItem>
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>

        {/* Optional: Worship Style */}
        <AccordionItem value="worship-style" className="rounded-xl border bg-card shadow-sm">
          <AccordionTrigger className="px-4 py-3">
            <div className="flex items-center gap-3">
              <Music className="h-4 w-4" />
              <div className="text-left">
                <div className="text-sm font-semibold">Worship style (optional)</div>
                <div className="text-sm text-muted-foreground">
                  Helps match music, liturgy, and overall feel.
                </div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <Select value={worshipStyle} onValueChange={setWorshipStyle}>
              <SelectTrigger>
                <SelectValue placeholder="No preference" />
              </SelectTrigger>
              <SelectContent>
                {WORSHIP_STYLES.map((w) => (
                  <SelectItem key={w.value} value={w.value}>
                    {w.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>

        {/* Optional: Distance */}
        <AccordionItem value="distance" className="rounded-xl border bg-card shadow-sm">
          <AccordionTrigger className="px-4 py-3">
            <div className="flex items-center gap-3">
              <Ruler className="h-4 w-4" />
              <div className="text-left">
                <div className="text-sm font-semibold">Distance (optional)</div>
                <div className="text-sm text-muted-foreground">
                  How far are you willing to travel?
                </div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <Select value={distance} onValueChange={setDistance}>
              <SelectTrigger>
                <SelectValue placeholder="No preference" />
              </SelectTrigger>
              <SelectContent>
                {DISTANCE_OPTIONS_MILES.map((d) => (
                  <SelectItem key={d.value} value={d.value}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {location === "Centre County" ? (
              <div className="mt-2 text-sm text-muted-foreground">
                Distance is set to <span className="font-medium">25 miles</span>{" "}
                for county-wide matching.
              </div>
            ) : null}
          </AccordionContent>
        </AccordionItem>

        {/* Optional: Priorities */}
        <AccordionItem value="priorities" className="rounded-xl border bg-card shadow-sm">
          <AccordionTrigger className="px-4 py-3">
            <div className="flex items-center gap-3">
              <ListChecks className="h-4 w-4" />
              <div className="text-left">
                <div className="text-sm font-semibold">Priorities (optional)</div>
                <div className="text-sm text-muted-foreground">
                  Pick what matters most (choose multiple).
                </div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="flex flex-wrap gap-2">
              {PRIORITY_OPTIONS.map((p) => {
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
              })}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Optional: Anything else */}
        <AccordionItem value="anything-else" className="rounded-xl border bg-card shadow-sm">
          <AccordionTrigger className="px-4 py-3">
            <div className="flex items-center gap-3">
              <MessageSquareText className="h-4 w-4" />
              <div className="text-left">
                <div className="text-sm font-semibold">
                  Anything else we should consider? (optional)
                </div>
                <div className="text-sm text-muted-foreground">
                  Childcare, accessibility, missions, music, teaching style, small groups…
                </div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <Textarea
              placeholder="Tell us what matters to you…"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              className="min-h-[110px]"
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Submit */}
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <Button onClick={handleSubmit} disabled={isSubmitDisabled} className="w-full">
          {isSearching ? "Finding your match…" : "Find my match"}
        </Button>
        <div className="mt-2 text-center text-xs text-muted-foreground">
          We’ll suggest one best match and two runner-ups.
        </div>
      </div>
    </div>
  );
}
