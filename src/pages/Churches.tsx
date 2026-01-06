import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import PageLayout from "@/components/layout/PageLayout";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["churches"],
    queryFn: async () => {
      const { data, error } = await supabase.from("churches").select("*").order("name");
      if (error) throw error;
      return (data ?? []) as ChurchRow[];
    },
  });

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return data ?? [];
    return (data ?? []).filter((c) => {
      const haystack = `${c.name} ${c.denomination} ${c.location} ${c.address} ${c.description}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [data, q]);

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground">Browse churches</h1>
              <p className="mt-2 max-w-2xl text-muted-foreground">
                Explore churches in and around State College. If you’d like recommendations tailored to you,
                use the guided match.
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

          <div className="mt-8 flex items-center gap-3">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by name, denomination, location, or keyword..."
                className="pl-9"
              />
            </div>
          </div>

          {isLoading && (
            <div className="mt-10 text-muted-foreground">Loading churches…</div>
          )}

          {error && (
            <div className="mt-10 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              Could not load churches. Please try again.
            </div>
          )}

          {!isLoading && !error && (
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {filtered.map((c) => (
                <Card key={c.id} className="shadow-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl">{c.name}</CardTitle>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {c.denomination && <Badge variant="secondary">{c.denomination}</Badge>}
                      {c.size && (
                        <Badge variant="outline" className="capitalize">
                          {c.size}
                        </Badge>
                      )}
                      {c.location && <Badge variant="secondary">{c.location}</Badge>}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {c.description && (
                      <p className="text-sm text-muted-foreground line-clamp-3">{c.description}</p>
                    )}
                    {c.address && (
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="mt-0.5 h-4 w-4 text-accent" />
                        <span>{c.address}</span>
                      </div>
                    )}
                    {c.website && (
                      <a
                        href={c.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        Visit website
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!isLoading && !error && filtered.length === 0 && (
            <div className="mt-10 text-muted-foreground">No churches found for that search.</div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
