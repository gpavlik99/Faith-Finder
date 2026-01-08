import PageLayout from "@/components/layout/PageLayout";
import Seo from "@/components/Seo";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, MapPin, ShieldCheck } from "lucide-react";

export default function AboutUs() {
  return (
    <PageLayout>
      <Seo
        title="How It Works"
        path="/about"
        description="Learn how Faith Compass helps you find a church in State College, PA using thoughtful questions and transparent explanations."
      />
      <div className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">How It Works</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Faith Compass helps you explore churches around State College with thoughtful questions and transparent, explainable recommendations.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Approach</h2>
            <p className="text-muted-foreground leading-relaxed">
              Faith Compass was built to support people who are exploring a church community in the State College, Pennsylvania area.
              We know this decision is personal — so our goal is to reduce overwhelm, surface helpful options, and make it easy to learn
              what each church is like. You’ll always see the “why” behind our suggestions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-card">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <span className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Heart className="w-6 h-6 text-accent" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">Personalized, respectful matching</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Share a few preferences and priorities. We use them to narrow the field and recommend a short, digestible set of options.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <span className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-accent" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">Community-first discovery</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      We highlight churches in and around State College — serving students, families, and long-term residents.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <span className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-accent" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">Local context</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Filter by distance and location so you can find options that fit your weekly routine.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <span className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-6 h-6 text-accent" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">Transparency</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Faith Compass is independent and non-affiliated. Suggestions are informational and based on public church information.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
