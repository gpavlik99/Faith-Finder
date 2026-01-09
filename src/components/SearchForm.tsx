import { useEffect, useState } from "react";
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
} from "@/lib/options";

type Props = {
  onSearch: (params: any) => void;
  isSearching: boolean;
};

export default function SearchForm({ onSearch, isSearching }: Props) {
  const [denomination, setDenomination] = useState("");
  const [size, setSize] = useState("");
  const [worshipStyle, setWorshipStyle] = useState("");
  const [location, setLocation] = useState("Centre County");
  const [distance, setDistance] = useState("");
  const [priorities, setPriorities] = useState<string[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState("");

  // Auto-set distance to 25 miles when Centre County is chosen
  useEffect(() => {
    if (location === "Centre County") {
      setDistance("25");
    }
  }, [location]);

  const togglePriority = (value: string) => {
    setPriorities((prev) =>
      prev.includes(value) ? prev.filter((p) => p !== value) : [...prev, value],
    );
  };

  const handleSubmit = () => {
    onSearch({
      denomination: denomination === "no-preference" ? "" : denomination,
      size,
      worshipStyle,
      location,
      distance,
      priorities,
      additionalInfo,
    });
  };

  return (
    <div className="space-y-6">
      {/* Denomination */}
      <div>
        <label className="font-medium">Denomination (optional)</label>
        <Select value={denomination} onValueChange={setDenomination}>
          <SelectTrigger>
            <SelectValue placeholder="No preference" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="no-preference">No preference</SelectItem>
            <SelectItem value="Catholic">Catholic</SelectItem>
            <SelectItem value="Protestant">Protestant</SelectItem>
            <SelectItem value="Non-denominational">Non-denominational</SelectItem>
            <SelectItem value="Orthodox">Orthodox</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Church Size */}
      <div>
        <label className="font-medium">Church size</label>
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
      </div>

      {/* Worship Style */}
      <div>
        <label className="font-medium">Worship style</label>
        <Select value={worshipStyle} onValueChange={setWorshipStyle}>
          <SelectTrigger>
            <SelectValue placeholder="Select a worship style" />
          </SelectTrigger>
          <SelectContent>
            {WORSHIP_STYLES.map((w) => (
              <SelectItem key={w.value} value={w.value}>
                {w.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Location */}
      <div>
        <label className="font-medium">Location</label>
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
          <p className="mt-2 text-sm text-muted-foreground">
            We’ll search across all of Centre County.
          </p>
        ) : null}
      </div>

      {/* Distance */}
      <div>
        <label className="font-medium">Distance (optional)</label>
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
          <p className="mt-2 text-sm text-muted-foreground">
            Distance is set to <span className="font-medium">25 miles</span>{" "}
            for county-wide matching.
          </p>
        ) : null}
      </div>

      {/* Priorities */}
      <div>
        <label className="font-medium">Priorities (optional)</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {PRIORITY_OPTIONS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => togglePriority(p.value)}
              className={`px-3 py-1 rounded-full border text-sm ${
                priorities.includes(p.value)
                  ? "bg-primary text-white"
                  : "bg-background"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Anything else */}
      <div>
        <label className="font-medium">
          Anything else you want us to consider? (optional)
        </label>
        <Textarea
          placeholder="Childcare needs, accessibility, missions, music style, etc."
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
        />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isSearching || !size || !location}
        className="w-full"
      >
        {isSearching ? "Finding churches…" : "Find my match"}
      </Button>
    </div>
  );
}
