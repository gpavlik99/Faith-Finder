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
  "Other"
];

const SIZES = [
  { value: "small", label: "Small (Under 100 members)" },
  { value: "medium", label: "Medium (100-500 members)" },
  { value: "large", label: "Large (Over 500 members)" }
];

const LOCATIONS = [
  "State College",
  "Bellefonte",
  "Pleasant Gap",
  "Boalsburg",
  "Lemont",
  "Pine Grove Mills"
];

interface SearchFormProps {
  onSearch: (results: MatchResults) => void;
  isSearching: boolean;
  setIsSearching: (value: boolean) => void;
}

const SearchForm = ({ onSearch, isSearching, setIsSearching }: SearchFormProps) => {
  const [denomination, setDenomination] = useState("No preference / Not sure");
  const [size, setSize] = useState("");
  const [location, setLocation] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!size || !location) {
      toast({
        title: "Missing Information",
        description: "Please select a church size and a location.",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    setErrorBanner(null);

    try {
      // Fetch all churches from database
      const { data: churches, error: churchError } = await supabase
        .from('churches')
        .select('*');

      if (churchError) throw churchError;

      // Call the AI matching function
      const { data: matchData, error: matchError } = await supabase.functions.invoke(
        'match-church',
        {
          body: {
            denomination: denomination || "No preference / Not sure",
            size,
            location,
            additionalInfo,
            churches
          }
        }
      );

      if (matchError) throw matchError;

      // Map the church IDs to full church objects
      const bestMatch = churches?.find(c => c.id === matchData.bestMatch.churchId);
      const runnerUps = matchData.runnerUps.map((ru: any) => 
        churches?.find(c => c.id === ru.churchId)
      ).filter(Boolean);

      if (bestMatch) {
        onSearch({
          bestMatch: {
            ...bestMatch,
            reason: matchData.bestMatch.reason
          },
          runnerUps: runnerUps.map((church: any, idx: number) => ({
            ...church,
            reason: matchData.runnerUps[idx]?.reason || ""
          }))
        });
      }

    } catch (error: any) {
      console.error("Search error:", error);

      const message = (error?.message || "").toString().toLowerCase();
      const isAiFailure =
        message.includes("openai") ||
        message.includes("match") ||
        message.includes("edge") ||
        message.includes("function") ||
        message.includes("timeout") ||
        message.includes("rate") ||
        message.includes("429") ||
        message.includes("503") ||
        message.includes("500");

      const bannerText = isAiFailure
        ? "Our church matcher is having trouble right now, so we couldn’t generate recommendations. Nothing was saved. Please try again in a minute — or browse churches instead."
        : "Something went wrong while searching. Please try again — or browse churches instead.";

      setErrorBanner(bannerText);

      toast({
        title: isAiFailure ? "We couldn’t generate matches right now" : "Search failed",
        description: isAiFailure
          ? "The AI matcher is temporarily unavailable. Please try again soon."
          : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Card className="shadow-card border-border/50">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="denomination">Denomination (Optional)</Label>
            <Select value={denomination} onValueChange={setDenomination}>
              <SelectTrigger id="denomination">
                <SelectValue placeholder="No preference / not sure" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                {DENOMINATIONS.map((denom) => (
                  <SelectItem key={denom} value={denom}>
                    {denom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="size">Church Size *</Label>
            <Select value={size} onValueChange={setSize}>
              <SelectTrigger id="size">
                <SelectValue placeholder="Select church size" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                {SIZES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger id="location">
                <SelectValue placeholder="Select a location" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                {LOCATIONS.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalInfo">
              Additional Information (Optional)
            </Label>
            <Textarea
              id="additionalInfo"
              placeholder="Tell us more about what you're looking for in a church..."
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <Button
            type="submit"
            disabled={isSearching}
            className="w-full bg-gradient-spiritual hover:opacity-90 transition-smooth"
            size="lg"
          >
            {isSearching ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Searching...
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

export default SearchForm{errorBanner && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>We couldn’t generate matches right now</AlertTitle>
            <AlertDescription>
              <p className="text-sm">{errorBanner}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link to="/churches">
                  <Button type="button" variant="outline" size="sm">
                    Browse churches
                  </Button>
                </Link>
                <Button type="button" variant="secondary" size="sm" onClick={() => setErrorBanner(null)}>
                  Dismiss
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        ;