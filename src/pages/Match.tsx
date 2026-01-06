import { useState } from "react";
import { Link } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Search, Sparkles } from "lucide-react";
import SearchForm from "@/components/SearchForm";
import SearchResults from "@/components/SearchResults";
import WhyWeAsk from "@/components/WhyWeAsk";
import type { MatchResults } from "@/types/match";

export default function Match() {
  const [results, setResults] = useState<MatchResults | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (searchResults: MatchResults) => {
    setResults(searchResults);
  };

  const handleNewSearch = () => {
    setResults(null);
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        {!results ? (
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2">
                <Sparkles className="h-5 w-5 text-accent" />
                <span className="text-sm font-medium text-accent-foreground">
                  Guided church matching
                </span>
              </div>

              <h1 className="text-4xl font-bold text-foreground md:text-5xl">
                Find a church community that fits your life
              </h1>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                Answer a few thoughtful questions. We’ll help you discover churches
                in and around State College — with clear, explainable recommendations.
              </p>

              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link to="/churches">
                  <Button variant="outline" className="gap-2">
                    <Search className="h-4 w-4" />
                    Browse churches instead
                  </Button>
                </Link>
              </div>
            </div>

            <WhyWeAsk />

            <SearchForm
              onSearch={handleSearch}
              isSearching={isSearching}
              setIsSearching={setIsSearching}
            />
          </div>
        ) : (
          <SearchResults results={results} onNewSearch={handleNewSearch} />
        )}
      </div>
    </PageLayout>
  );
}
