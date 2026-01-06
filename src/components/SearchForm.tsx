import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import { Search, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { MatchResults } from "@/types/match";

const DENOMINATIONS = [
  "No preference / Not sure",
  "Baptist",
  "Catholic",
  "Lutheran",
  "Methodist",
  "Presbyterian",
  "Episcopal",
  "Assembly of God",
  "Non-denominational",
  "Other",
];

const SIZES = [
  { value: "small", label: "Small (Under 100 members)" },
  { value: "medium", label: "Medium (100–500 members)" },
  { value: "large", label: "Large (Over 500 members)" },
];

const LOCATIONS = [
  "State College",
  "Bellefonte",
  "Pleasant Gap",
  "Boalsburg",
  "Lemont",
  "Pine Grove Mills",
];

interface SearchFormProps {
  onSearch: (results: MatchResults) => void;
  isSearching: boolean;
  setIsSearching: (value: boolean) => void;
}

const SearchForm = ({
  onSearch,
  isSearching,
  setIsSearching,
}: SearchFormProps) => {
  const [denomination_,
  setDenomination] = useState("No preference / Not sure");
  const [size, setSize] = useState("");
  const [location, setLocation] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  const { toast } = useToast();

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
        .map((ru: any) =>
          churches?.find((c) => c.id === ru.churchId)
        )
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
        description:
          "The AI matcher is temporarily unavailable. Please try again soon.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Card className="shadow-card border-border/50">
      <CardContent className="pt-6 space-y-4">
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
          <div className="space-y-2">
            <Label>Denomination (Optional)</Label>
            <Select value={denomination_} onValueChange={setDenomination}>
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
            <Label>Church Size *</Label>
            <Select value={size} onValueChange={setSize}>
              <SelectTrigger>
                <SelectValue placeholder="Select church size" />
              </SelectTrigger>
              <SelectContent>
                {SIZES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Location *</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger>
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

          <div className="space-y-2">
            <Label>Additional Information (Optional)</Label>
            <Textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              rows={4}
            />
          </div>

          <Button type="submit" disabled={isSearching} size="lg" className="w-full">
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
        </form>
      </CardContent>
    </Card>
  );
};

export default SearchForm;
