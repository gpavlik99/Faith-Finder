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
          <div className="text-sm text-muted-foreground">{props.description}</div>
        ) : null}
      </div>
      <div className="mt-3">{props.children}</div>
    </div>
  );
}

export default function SearchForm({ onSearch, isSearching }: Props) {
  const [denomination, setDenomination] = useState(NO_PREFERENCE_VALUE);
  const [size, setSize] = useState("");
  const [worshipStyle, setWorshipStyle] = useState(NO_PREFERENCE_VALUE);
  const [location, setLocation] = useState("Centre County");
  const [distance, setDistance] = useState(NO_PREFERENCE_VALUE);
  const [priorities, setPriorities] = useState<string[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState("");

  // Auto-set distance to 25 miles when Centre County is chosen
  useEffect(() => {
    if (location === "Centre County") {
      setDistance("25");
    } else {
      // If user moves away from Centre County and distance was auto-set, default back to "No preference"
      if (distance === "25") setDistance(NO_PREFERENCE_VALUE);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const isSubmitDisabled = useMemo(() => {
    return isSearching || !size || !location;
  }, [isSearching, size, location]);

  const togglePriority = (value: string) => {
    setPriorities((prev) =>
      prev.includes(value) ? prev.filter((p) => p !== value) : [...prev, value],
    );
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
      <FieldBlock
        title="Denomination (optional)"
        description="Choose a tradition if it matters to you. Otherwise, leave it open."
      >
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
      </FieldBlock>

      <FieldBlock
        title="Church size"
        description="Pick the community size you’ll feel most comfortable in."
      >
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
      </FieldBlock>

      <FieldBlock
        title="Worship style"
        description="This helps match music, liturgy, and the overall feel."
      >
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
      </FieldBlock>

      <FieldBlock
        title="Location"
        description="Where should we search?"
      >
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
            {DISTANCE_OPTIONS_MILES.map((d) => (
              <SelectItem key={d.value} value={d.value}>
                {d.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {location === "Centre County" ? (
          <div className="mt-2 text-sm text-muted-foreground">
            Distance is set to <span className="font-medium">25 miles</span> for county-wide matching.
          </div>
        ) : null}
      </FieldBlock>

      <FieldBlock
        title="Priorities (optional)"
        description="Pick what matters most to you (you can choose multiple)."
      >
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
      </FieldBlock>

      <FieldBlock
        title="Anything else you want us to consider? (optional)"
        description="Examples: childcare, accessibility, missions, music, teaching style, small groups."
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
          {isSearching ? "Finding your match…" : "Find my match"}
        </Button>
        <div className="mt-2 text-center text-xs text-muted-foreground">
          We’ll suggest one best match and two runner-ups.
        </div>
      </div>
    </div>
  );
}
