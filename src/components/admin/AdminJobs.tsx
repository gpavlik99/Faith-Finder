import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
      "Visits each church website, detects changes (ETag/Last-Modified/hash), and updates the cached site summary used for matching (slower).",
    icon: <Globe className="h-4 w-4" />,
  },
  {
    name: "enrich-churches",
    title: "Enrich churches with AI",
    description:
      "Uses the cached website summaries to add structured fields like worship style, ministries, and a clean summary back into the churches table.",
    icon: <Sparkles className="h-4 w-4" />,
  },
];

export default function AdminJobs() {
  const { toast } = useToast();
  const [adminKey, setAdminKey] = useState("");
  const [running, setRunning] = useState<JobName | null>(null);
  const [lastResult, setLastResult] = useState<{ job: JobName; result: JobResult } | null>(null);

  const baseUrl = useMemo(() => {
    const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
    return url?.replace(/\/$/, "") || "";
  }, []);

  async function runJob(job: JobName) {
    if (!baseUrl) {
      toast({
        title: "Missing Supabase URL",
        description: "VITE_SUPABASE_URL is not set for this deployment.",
        variant: "destructive",
      });
      return;
    }

    setRunning(job);
    setLastResult(null);

    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;

      const resp = await fetch(`${baseUrl}/functions/v1/${job}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(adminKey.trim() ? { "x-admin-import-key": adminKey.trim() } : {}),
        },
        // Body is optional; keep empty object for consistent JSON parsing
        body: JSON.stringify({}),
      });

      const text = await resp.text();
      const json = text ? (JSON.parse(text) as JobResult) : ({ ok: resp.ok } as JobResult);

      setLastResult({ job, result: json });

      if (!resp.ok) {
        toast({
          title: "Job failed",
          description: json?.error ? String(json.error) : `Request failed (${resp.status})`,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Job started",
        description: "Completed successfully. See results below.",
      });
    } catch (e: any) {
      console.error(e);
      toast({
        title: "Job error",
        description: e?.message || "Unknown error",
        variant: "destructive",
      });
    } finally {
      setRunning(null);
    }
  }

  return (
    <Card className="border-border/60">
      <CardHeader className="space-y-1">
        <CardTitle className="text-lg">Admin tools</CardTitle>
        <CardDescription>
          Run maintenance jobs to keep the church directory up to date. These are slower operations and may take a minute.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="adminKey" className="text-sm">
              Admin key (recommended)
            </Label>
            <span className="text-xs text-muted-foreground">Not stored</span>
          </div>
          <Input
            id="adminKey"
            type="password"
            placeholder="Paste your ADMIN_IMPORT_KEY here"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            This key prevents the public from triggering crawls/imports. If you configured your functions to require login only, you can leave it blank.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {JOBS.map((j) => (
            <Card key={j.name} className="border-border/60">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <CardTitle className="text-sm">{j.title}</CardTitle>
                    <CardDescription className="text-xs">{j.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Button
                  className="w-full"
                  variant="secondary"
                  disabled={running !== null}
                  onClick={() => runJob(j.name)}
                >
                  {running === j.name ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Running…
                    </>
                  ) : (
                    <>
                      <span className="mr-2 inline-flex">{j.icon}</span>
                      Run
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {lastResult && (
          <div className="rounded-lg border border-border/60 bg-card/40 p-4">
            <div className="text-sm font-medium text-foreground">Last run: {lastResult.job}</div>
            <pre className="mt-2 max-h-72 overflow-auto rounded-md bg-background p-3 text-xs text-muted-foreground">
{JSON.stringify(lastResult.result, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
