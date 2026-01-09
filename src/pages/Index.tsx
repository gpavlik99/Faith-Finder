import { Link } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import heroImage from "@/assets/hero-state-college.jpg";
import { ArrowRight, CheckCircle2, Compass, MapPin, ShieldCheck } from "lucide-react";

const questionChips = [
  "Denomination (optional)",
  "Church size",
  "Worship style",
  "Location & distance",
  "Priorities",
  "Anything else?",
];

const previewCards = [
  {
    name: "Example: Hope Fellowship",
    neighborhood: "State College",
    distance: "~3.2 miles",
    denomination: "Non-denominational",
    size: "Medium",
    why: ["Matches a medium-size community", "Strong family and small-group focus"],
  },
  {
    name: "Example: Grace Lutheran",
    neighborhood: "Boalsburg",
    distance: "~4.8 miles",
    denomination: "Lutheran",
    size: "Small",
    why: ["More traditional worship style", "Easy commute from State College"],
  },
  {
    name: "Example: Campus Community Church",
    neighborhood: "Downtown",
    distance: "~1.4 miles",
    denomination: "Interdenominational",
    size: "Large",
    why: ["Active student community", "Multiple service options"],
  },
];

export default function Index() {
  return (
    <PageLayout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-background" />

        <div className="relative">
          <div className="container mx-auto px-4 py-20 md:py-28">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-white">
                <Compass className="h-5 w-5" />
                <span className="text-sm font-medium">Church discovery for State College, PA</span>
              </div>

              <h1 className="text-4xl font-bold text-white drop-shadow md:text-6xl">
                Find a church community that fits your life in State College
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-lg text-white/90 drop-shadow">
                Faith Compass helps you discover local churches that align with your beliefs, values, and
                stage of life — using thoughtful questions and transparent recommendations.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link to="/match">
                  <Button size="lg" className="bg-gradient-spiritual hover:opacity-95">
                    Find My Church Match
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/churches">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white/10 text-white hover:bg-white/15"
                  >
                    Browse Churches
                  </Button>
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {questionChips.map((c) => (
                  <span key={c} className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/90">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground">How Faith Compass Helps</h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              A simple flow designed to help you explore confidently — without feeling overwhelmed.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                  Step 1 — Tell us what matters
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Share what you’re looking for — denomination (optional), church size, worship style,
                location, and priorities.
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ShieldCheck className="h-5 w-5 text-accent" />
                  Step 2 — We do the research
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                We review publicly available church information and community details in the State
                College area.
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5 text-accent" />
                  Step 3 — You explore the results
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Get a short list of churches that may be a good fit — with clear explanations so you can
                decide for yourself.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* GUIDED TEASER */}
      <section className="bg-muted/30">
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-10 md:grid-cols-2 md:items-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Start with a few simple questions</h2>
                <p className="mt-3 text-muted-foreground">
                  You don’t need to have everything figured out. We’ll help you narrow the options in a
                  way that feels clear and respectful.
                </p>

                <ul className="mt-6 space-y-2 text-sm">
                  {[
                    "Do you already have a denomination in mind?",
                    "What size church feels most comfortable?",
                    "What worship style are you looking for?",
                    "Where do you want to search, and how far will you travel?",
                    "What are your top priorities?",
                    "Anything else we should consider?",
                  ].map((q) => (
                    <li key={q} className="flex items-start gap-2">
                      <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent/15">
                        <CheckCircle2 className="h-4 w-4 text-accent" />
                      </span>
                      {q}
                    </li>
                  ))}
                </ul>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link to="/match">
                    <Button className="bg-gradient-spiritual hover:opacity-95">
                      Answer 6 questions to get started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/churches">
                    <Button variant="outline">Browse churches instead</Button>
                  </Link>
                </div>
              </div>

              <div className="space-y-4">
                {previewCards.map((c) => (
                  <Card key={c.name} className="shadow-card">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <CardTitle className="text-lg">{c.name}</CardTitle>
                          <div className="mt-1 text-sm text-muted-foreground">
                            {c.neighborhood} • {c.distance}
                          </div>
                        </div>
                        <Badge variant="secondary" className="whitespace-nowrap">
                          Preview
                        </Badge>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge variant="secondary">{c.denomination}</Badge>
                        <Badge variant="outline" className="capitalize">
                          {c.size}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-sm font-medium text-foreground">Why this might fit you</div>
                      <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                        {c.why.map((w) => (
                          <li key={w} className="flex items-start gap-2">
                            <span className="mt-1 inline-block h-2 w-2 rounded-full bg-accent" />
                            {w}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LOCAL + TRUST */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-xl">Built for the State College community</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Faith Compass focuses on churches in and around State College — including communities
                serving students, families, and long-term residents. We’re designed to help you explore
                with clarity and confidence.
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-xl">Transparent by design</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Faith Compass is independent and non-affiliated. Recommendations are informational and
                based on public church information. You’ll always see the “why” behind each suggestion.
              </CardContent>
            </Card>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">What Faith Compass is</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent/15">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                    </span>
                    A discovery and guidance tool
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent/15">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                    </span>
                    A starting point for exploration
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent/15">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                    </span>
                    A way to learn about local churches in one place
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">What Faith Compass is not</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent/15">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                    </span>
                    A church or religious authority
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent/15">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                    </span>
                    A ranking or endorsement platform
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent/15">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                    </span>
                    A replacement for personal discernment
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 rounded-2xl border border-border/60 bg-muted/20 p-8 text-center">
            <h2 className="text-3xl font-bold text-foreground">Start your search with intention</h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Get a short, explainable set of recommendations — then explore at your own pace.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/match">
                <Button size="lg" className="bg-gradient-spiritual hover:opacity-95">
                  Find My Church Match
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/churches">
                <Button size="lg" variant="outline">
                  Browse churches
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
