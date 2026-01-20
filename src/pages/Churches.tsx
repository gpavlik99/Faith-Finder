import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import PageLayout from "@/components/layout/PageLayout";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Search, ChevronDown, ChevronUp, Phone, Globe, Church } from "lucide-react";
import { supabase } from "@/integrations/client";

type ChurchRow = {
  id: string;
  name: string;
  denomination: string;
  size: string;
  location: string;
  address: string;
  description: string;
  website?: string | null;
  phone?: string | null;
};

export default function Churches() {
  const [q, setQ] = useState("");
  const [denominationFilter, setDenominationFilter] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["churches"],
    queryFn: async () => {
      const { data, error } = await supabase.from("churches").select("*").order("name");
      if (error) throw error;
      return (data ?? []) as ChurchRow[];
    },
  });

  // Get unique values for filters
  const denominations = useMemo(() => {
    if (!data) return [];
    const unique = [...new Set(data.map(c => c.denomination).filter(Boolean))];
    return unique.sort();
  }, [data]);

  const locations = useMemo(() => {
    if (!data) return [];
    const unique = [...new Set(data.map(c => c.location).filter(Boolean))];
    return unique.sort();
  }, [data]);

  const sizes = useMemo(() => {
    return ["small", "medium", "large"];
  }, []);

  const filtered = useMemo(() => {
    let result = data ?? [];

    // Apply search filter
    const term = q.trim().toLowerCase();
    if (term) {
      result = result.filter((c) => {
        const haystack = `${c.name} ${c.denomination} ${c.location} ${c.address} ${c.description}`.toLowerCase();
        return haystack.includes(term);
      });
    }

    // Apply denomination filter
    if (denominationFilter !== "all") {
      result = result.filter(c => c.denomination === denominationFilter);
    }

    // Apply size filter
    if (sizeFilter !== "all") {
      result = result.filter(c => c.size === sizeFilter);
    }

    // Apply location filter
    if (locationFilter !== "all") {
      result = result.filter(c => c.location === locationFilter);
    }

    return result;
  }, [data, q, denominationFilter, sizeFilter, locationFilter]);

  const toggleExpanded = (id: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const clearFilters = () => {
    setQ("");
    setDenominationFilter("all");
    setSizeFilter("all");
    setLocationFilter("all");
  };

  const hasActiveFilters = q || denominationFilter !== "all" || sizeFilter !== "all" || locationFilter !== "all";

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground">Browse Churches</h1>
              <p className="mt-2 max-w-2xl text-muted-foreground">
                Explore churches in and around State College. Click any church to learn more.
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => refetch()} variant="outline">
                Refresh
              </Button>
              <Button className="bg-gradient-spiritual hover:opacity-95" asChild>
                <Link to="/match">Find My Match</Link>
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by name, denomination, location, or keyword..."
                className="pl-9"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            <Select value={denominationFilter} onValueChange={setDenominationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Denomination" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Denominations</SelectItem>
                {denominations.map(d => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sizeFilter} onValueChange={setSizeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sizes</SelectItem>
                {sizes.map(s => (
                  <SelectItem key={s} value={s} className="capitalize">
                    {s === "small" && "Small (1-100)"}
                    {s === "medium" && "Medium (101-500)"}
                    {s === "large" && "Large (500+)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map(l => (
                  <SelectItem key={l} value={l}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            )}
          </div>

          {/* Results Count */}
          {!isLoading && !error && (
            <div className="mt-6 text-sm text-muted-foreground">
              Showing {filtered.length} {filtered.length === 1 ? 'church' : 'churches'}
              {hasActiveFilters && ` (filtered from ${data?.length || 0} total)`}
            </div>
          )}

          {isLoading && (
            <div className="mt-10 text-center text-muted-foreground">Loading churches…</div>
          )}

          {error && (
            <div className="mt-10 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              Could not load churches. Please try again.
            </div>
          )}

          {!isLoading && !error && (
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {filtered.map((c) => {
                const isExpanded = expandedCards.has(c.id);
                return (
                  <Card 
                    key={c.id} 
                    className="shadow-card hover:shadow-lg transition-all duration-200 cursor-pointer"
                    onClick={() => toggleExpanded(c.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Church className="w-5 h-5 text-accent" />
                            <CardTitle className="text-xl">{c.name}</CardTitle>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {c.denomination && (
                              <Badge variant="secondary" className="text-xs">
                                {c.denomination}
                              </Badge>
                            )}
                            {c.size && (
                              <Badge variant="outline" className="capitalize text-xs">
                                {c.size}
                              </Badge>
                            )}
                            {c.location && (
                              <Badge variant="secondary" className="text-xs">
                                {c.location}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpanded(c.id);
                          }}
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-3">
                      {/* Always visible info */}
                      {c.address && (
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="mt-0.5 h-4 w-4 text-accent shrink-0" />
                          <span className="text-muted-foreground">{c.address}</span>
                        </div>
                      )}

                      {/* Expandable content */}
                      {isExpanded && (
                        <div className="space-y-3 pt-2 border-t">
                          {c.description && (
                            <div>
                              <p className="text-sm font-semibold text-foreground mb-1">About</p>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {c.description}
                              </p>
                            </div>
                          )}

                          <div className="flex flex-col gap-2">
                            {c.phone && (
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4 text-accent" />
                                <a 
                                  href={`tel:${c.phone}`}
                                  className="text-primary hover:underline"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {c.phone}
                                </a>
                              </div>
                            )}
                            
                            {c.website && (
                              <div className="flex items-center gap-2 text-sm">
                                <Globe className="h-4 w-4 text-accent" />
                                <a
                                  href={c.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Visit Website
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {!isExpanded && c.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {c.description}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {!isLoading && !error && filtered.length === 0 && (
            <div className="mt-10 text-center">
              <p className="text-muted-foreground">No churches found matching your filters.</p>
              {hasActiveFilters && (
                <Button onClick={clearFilters} variant="link" className="mt-2">
                  Clear all filters
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
