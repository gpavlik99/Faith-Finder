import { MapPin, Users, Phone, Globe, ExternalLink, Star } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ChurchCardProps {
  church: {
    id: string;
    name: string;
    denomination: string;
    size: string;
    address: string;
    phone?: string | null;
    website?: string | null;
    distance?: string;
    description?: string | null;
  };
  matchReasons?: string[];
  rank?: number;
  showActions?: boolean;
}

export function ChurchCard({ 
  church, 
  matchReasons, 
  rank, 
  showActions = true 
}: ChurchCardProps) {
  const sizeDisplay = {
    small: "Small (1-100)",
    medium: "Medium (100-500)",
    large: "Large (500+)"
  }[church.size] || church.size;

  return (
    <Card className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/50 relative overflow-hidden bg-gradient-to-br from-card to-card/50">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10 group-hover:bg-primary/10 transition-colors" />
      
      {/* Rank badge for top matches */}
      {rank && rank <= 3 && (
        <div className="absolute top-4 right-4 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 text-white font-bold shadow-lg ring-4 ring-amber-400/20 z-10">
          <Star className="h-4 w-4 fill-white absolute" />
          <span className="relative z-10 text-xs">#{rank}</span>
        </div>
      )}
      
      <CardHeader className="pb-4">
        <div className="space-y-4">
          <div>
            <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
              {church.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {church.address}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant="secondary" 
              className="font-semibold bg-primary/10 text-primary border-primary/20"
            >
              {church.denomination}
            </Badge>
            <Badge 
              variant="outline" 
              className="capitalize flex items-center gap-1.5 border-2"
            >
              <Users className="h-3.5 w-3.5" />
              <span>{sizeDisplay}</span>
            </Badge>
            {church.distance && (
              <Badge 
                variant="outline" 
                className="flex items-center gap-1.5 border-2"
              >
                <MapPin className="h-3.5 w-3.5" />
                <span>{church.distance}</span>
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Match reasons - highlighted section */}
        {matchReasons && matchReasons.length > 0 && (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 rounded-xl blur-sm" />
            <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 rounded-xl p-5 border-2 border-blue-200/50 dark:border-blue-800/50 shadow-inner">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                <div className="text-sm font-bold text-blue-900 dark:text-blue-100 uppercase tracking-wide">
                  Why This Might Be Perfect For You
                </div>
              </div>
              <ul className="space-y-2.5">
                {matchReasons.map((reason, idx) => (
                  <li 
                    key={idx} 
                    className="flex items-start gap-3 text-sm text-blue-900 dark:text-blue-100 font-medium"
                  >
                    <span className="mt-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20 flex-shrink-0">
                      <span className="h-2 w-2 rounded-full bg-blue-500" />
                    </span>
                    <span className="leading-relaxed">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Description */}
        {church.description && (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed line-clamp-3">
              {church.description}
            </p>
          </div>
        )}

        {/* Contact information */}
        <div className="space-y-3 pt-3 border-t border-border/50">
          <div className="flex items-start gap-3 text-sm group/contact">
            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground group-hover/contact:text-primary transition-colors" />
            <span className="text-muted-foreground group-hover/contact:text-foreground transition-colors">
              {church.address}
            </span>
          </div>
          
          {church.phone && (
            <div className="flex items-center gap-3 text-sm group/contact">
              <Phone className="h-4 w-4 flex-shrink-0 text-muted-foreground group-hover/contact:text-primary transition-colors" />
              <a 
                href={`tel:${church.phone}`} 
                className="text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                {church.phone}
              </a>
            </div>
          )}
          
          {church.website && (
            <div className="flex items-center gap-3 text-sm group/contact">
              <Globe className="h-4 w-4 flex-shrink-0 text-muted-foreground group-hover/contact:text-primary transition-colors" />
              <a 
                href={church.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 font-medium flex items-center gap-1.5 transition-colors"
              >
                <span>Visit Website</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Call to action */}
        {showActions && (
          <div className="pt-2">
            <Button 
              variant="outline" 
              className="w-full font-semibold group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all shadow-sm"
            >
              Learn More About {church.name.split(' ')[0]}
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
