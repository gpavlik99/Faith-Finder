import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, RefreshCcw, Globe, Sparkles } from "lucide-react";

type JobName = "import-centre-county-churches" | "refresh-church-sites" | "enrich-churches";

type JobResult = {
  ok?: boolean;
  error?: string;
  details?: unknown;
  [key: string]: unknown;
};

const JOBS: Array<{
  name: JobName;
  title: string;
  description: string;
  icon: React.ReactNode;
}> = [
  {
    name: "import-centre-county-churches",
    title: "Update church list (Centre County)",
    description:
      "Pulls churches from OpenStreetMap for the strict Centre County boundary and upserts into your database (adds new + updates existing).",
    icon: <RefreshCcw className="h-4 w-4" />,
  },
  {
    name: "refresh-church-sites",
    title: "Refresh church websites",
    description:
      "Visits each church website, detects changes (ETag/Last-Modified/hash), and updates cached site summaries used for matching (slower).",
    icon: <Globe className="h-4 w-4" />,
  },
  {
    name: "enrich-churches",
    title: "Enrich churches with AI",
    description:
      "Uses cached website summaries to add structured fields like worship style, ministries, and a clean summary back into the churches table.",
    icon: <Sparkles className="h-4 w-4" />,
  },
];

export default function AdminJobs({ adminEmail }: { adminEmail: string }) {
  const { toast } = useToast();
  const [running, setRunning] = useState<JobName | null>(null);
  const [lastResult, setLastResult] = useState<{ job: JobName; result: JobResult } | null>(null);

  const baseUrl = useMemo(() => {
    const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
    return url?.replace(/\/$/, "") ?? "";
  }, []);

  const runJob = async (job: JobName) => {
    if (!baseUrl) {
      toast({
        title: "Missing Supabase URL",
        description: "VITE_SUPABASE_URL is not configured.",
        variant: "destructive",
      });
      return;
    }

    setRunning(job);
    setLastResult(null);

    try {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (!session?.access_token) {
        toast({
          title: "Sign in required",
          description: "Please sign in before running admin tools.",
          variant: "destructive",
        });
        return;
      }

      const email = (session.user?.email || "").toLowerCase();
      if (email !== adminEmail.toLowerCase()) {
        toast({
          title: "Access denied",
          description: `Only ${adminEmail} can run these tools.`,
          variant: "destructive",
        });
        return;
      }

      const resp = await fetch(`${baseUrl}/functions/v1/${job}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({}),
      });

      const text = await resp.text();
      const json = text ? (JSON.parse(text) as JobResult) : ({ ok: resp.ok } as JobResult);

      setLastResult({ job, result: json });

      if (!resp.ok) {
        toast({
          title: "Job failed",
          description: json.error ? String(json.error) : "The server returned an error.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Done",
        description: "Job completed successfully.",
      });
    } catch (e: any) {
      console.error("Admin job error:", e);
      toast({
        title: "Job failed",
        description: e?.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setRunning(null);
    }
  };

  return (
    <Card className="border-border/60">
      <CardHeader className="space-y-1">
        <CardTitle className="text-lg">Admin tools</CardTitle>
        <CardDescription>
          Keep the directory up to date. These are slower operations and may take a minute.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          {JOBS.map((job) => (
            <Button
              key={job.name}
              variant="outline"
              className="h-auto justify-start gap-3 p-4"
              onClick={() => runJob(job.name)}
              disabled={running !== null}
            >
              <span className="mt-0.5 text-muted-foreground">{job.icon}</span>
              <span className="text-left">
                <span className="block font-medium">
                  {job.title}
                  {running === job.name ? (
                    <span className="ml-2 inline-flex items-center text-sm text-muted-foreground">
                      <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                      Running…
                    </span>
                  ) : null}
                </span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  {job.description}
                </span>
              </span>
            </Button>
          ))}
        </div>

        {lastResult ? (
          <div className="rounded-lg border border-border/60 bg-card/40 p-4">
            <div className="text-sm font-medium">Latest result: {lastResult.job}</div>
            <pre className="mt-2 max-h-64 overflow-auto rounded-md bg-background p-3 text-xs">
{JSON.stringify(lastResult.result, null, 2)}
            </pre>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}