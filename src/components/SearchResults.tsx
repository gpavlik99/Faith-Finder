import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Globe, Search, ChurchIcon } from "lucide-react";
import type { MatchResults } from "@/types/match";
import ChurchMap from "./ChurchMap";

interface SearchResultsProps {
  results: MatchResults;
  onNewSearch: () => void;
}

const SearchResults = ({ results, onNewSearch }: SearchResultsProps) => {
  const { bestMatch, runnerUps } = results;

  const ChurchCard = ({ church, isBest = false }: { church: any; isBest?: boolean }) => (
    <Card className={`shadow-card ${isBest ? 'border-accent border-2' : ''}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <ChurchIcon className={`w-5 h-5 ${isBest ? 'text-accent' : 'text-primary'}`} />
              {isBest && (
                <Badge className="bg-accent text-accent-foreground">
                  Best Match
                </Badge>
              )}
            </div>
            <CardTitle className="text-2xl mb-1">{church.name}</CardTitle>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="secondary">{church.denomination}</Badge>
              <Badge variant="outline" className="capitalize">{church.size}</Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground italic border-l-4 border-accent pl-4">
          {church.reason}
        </p>

        {church.description && (
          <p className="text-foreground">{church.description}</p>
        )}

        <div className="space-y-2 pt-2 border-t border-border">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
            <span className="text-sm text-foreground">{church.address}</span>
          </div>
          {church.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-accent" />
              <span className="text-sm text-foreground">{church.phone}</span>
            </div>
          )}
          {church.website && (
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-accent" />
              <a 
                href={church.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                Visit Website
              </a>
            </div>
          )}
        </div>

        {church.latitude && church.longitude && (
          <ChurchMap 
            latitude={church.latitude} 
            longitude={church.longitude}
            churchName={church.name}
          />
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-3 text-foreground">Your Church Matches</h2>
        <p className="text-muted-foreground mb-6">
          Based on your preferences, we found these wonderful churches for you
        </p>
        <Button onClick={onNewSearch} variant="outline" className="gap-2">
          <Search className="w-4 h-4" />
          New Search
        </Button>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold mb-4 text-accent">🎯 Perfect Match</h3>
          <ChurchCard church={bestMatch} isBest />
        </div>

        {runnerUps.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-4 text-foreground">
              Other Great Options
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              {runnerUps.map((church, idx) => (
                <ChurchCard key={idx} church={church} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;