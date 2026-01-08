import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChurchIcon, Globe, Info, MapPin, Phone, Search } from "lucide-react";
import type { MatchResults } from "@/types/match";
import ChurchMap from "./ChurchMap";

interface SearchResultsProps {
  results: MatchResults;
  onNewSearch: () => void;
}

function WhyThisMatch({
  reason,
  align = "end",
}: {
  reason?: string;
  align?: "start" | "center" | "end";
}) {
  if (!reason || !reason.trim()) return null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border/60 bg-background text-muted-foreground shadow-sm transition-colors hover:bg-accent/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Why this match"
          title="Why this match"
        >
          <Info className="h-4 w-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" align={align} className="max-w-sm">
        <div className="space-y-1">
          <div className="text-sm font-semibold text-foreground">
            Why this match
          </div>
          <div className="text-sm text-muted-foreground">{reason}</div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

const SearchResults = ({ results, onNewSearch }: SearchResultsProps) => {
  const { bestMatch, runnerUps } = results;

  const ChurchCard = ({
    church,
    isBest = false,
  }: {
    church: any;
    isBest?: boolean;
  }) => (
    <Card className={`border-border/60 shadow-card ${isBest ? "border-2 border-accent" : ""}`}>
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <ChurchIcon className={`h-5 w-5 ${isBest ? "text-accent" : "text-primary"}`} />
              {isBest && (
                <Badge className="bg-accent text-accent-foreground">
                  Best Match
                </Badge>
              )}
              <Badge variant="secondary">{church.denomination}</Badge>
              <Badge variant="outline">{church.size}</Badge>
            </div>

            <CardTitle className="mt-2 text-2xl leading-tight">
              {church.name}
            </CardTitle>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {church.location}
              </span>
              {church.address ? (
                <span className="text-muted-foreground/80">• {church.address}</span>
              ) : null}
            </div>
          </div>

          <WhyThisMatch reason={church.reason} align="end" />
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {church.description ? (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {church.description}
          </p>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          {typeof church.latitude === "number" && typeof church.longitude === "number" ? (
            <ChurchMap
              latitude={church.latitude}
              longitude={church.longitude}
              churchName={church.name}
            />
          ) : (
            <div className="rounded-lg border border-border/60 bg-card/40 p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                Map unavailable for this church
              </div>
            </div>
          )}

          <div className="space-y-3 rounded-lg border border-border/60 bg-card/40 p-4">
            <div className="text-sm font-medium text-foreground">Contact</div>

            {church.phone ? (
              <a
                href={`tel:${church.phone}`}
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <Phone className="h-4 w-4" />
                {church.phone}
              </a>
            ) : (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                Phone not listed
              </div>
            )}

            {church.website ? (
              <a
                href={church.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <Globe className="h-4 w-4" />
                Visit website
              </a>
            ) : (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Globe className="h-4 w-4" />
                Website not listed
              </div>
            )}

            {church.reason ? (
              <div className="pt-2">
                <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                  <Info className="h-3.5 w-3.5" />
                  Tap ⓘ for “Why this match”
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">
              Your recommendations
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Each card includes a ⓘ icon that explains why it was recommended.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={onNewSearch} size="sm" className="h-9">
              <Search className="mr-2 h-4 w-4" />
              New search
            </Button>

            <Link to="/churches">
              <Button variant="outline" size="sm" className="h-9">
                Browse all churches
              </Button>
            </Link>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-accent">
                🎯 Best match
              </h3>
              <WhyThisMatch reason={bestMatch.reason} />
            </div>

            <ChurchCard church={bestMatch} isBest />
          </div>

          {runnerUps?.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">
                Other great options
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                {runnerUps.map((church, idx) => (
                  <ChurchCard key={church.id ?? idx} church={church} />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default SearchResults;
