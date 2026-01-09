import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useUserSettings } from "@/hooks/useUserSettings";
import { DENOMINATIONS, SIZES_OPTIONAL, LOCATIONS } from "@/lib/options";
import { useTheme } from "next-themes";
import { Settings as SettingsIcon, RotateCcw, Sun, Moon, Monitor } from "lucide-react";

export default function Settings() {
  const { settings, update, reset } = useUserSettings();
  const { theme, setTheme } = useTheme();

  const effectiveTheme = (theme ?? settings.theme) as "system" | "light" | "dark";

  const handleThemeChange = (next: "system" | "light" | "dark") => {
    update({ theme: next });
    setTheme(next);
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2">
                <SettingsIcon className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium text-accent-foreground">Settings</span>
              </div>
              <h1 className="mt-4 text-3xl font-bold text-foreground">Personalize your defaults</h1>
              <p className="mt-2 text-muted-foreground">
                These settings pre-fill the church matcher to save you time. Nothing here is shared.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              className="gap-2"
              onClick={() => {
                reset();
                setTheme("system");
              }}
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>

          <div className="grid gap-6">
            <Card className="shadow-card border-border/50">
              <CardHeader>
                <CardTitle>Matcher defaults</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Default denomination</Label>
                  <Select
                    value={settings.defaultDenomination}
                    onValueChange={(v) => update({ defaultDenomination: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="No preference / Not sure" />
                    </SelectTrigger>
                    <SelectContent>
                      {DENOMINATIONS.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Default church size</Label>
                  <Select
                    value={settings.defaultSize === "" ? "__no_preference__" : settings.defaultSize}
                    onValueChange={(v) => update({ defaultSize: v === "__no_preference__" ? "" : v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="No preference" />
                    </SelectTrigger>
                    <SelectContent>
                      {SIZES_OPTIONAL.map((s) => {
                        const value = s.value === "" ? "__no_preference__" : s.value;
                        return (
                          <SelectItem key={value} value={value}>
                            {s.label}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Default location</Label>
                  <Select value={settings.defaultLocation} onValueChange={(v) => update({ defaultLocation: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="State College" />
                    </SelectTrigger>
                    <SelectContent>
                      {LOCATIONS.map((l) => (
                        <SelectItem key={l} value={l}>
                          {l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card border-border/50">
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Label>Theme</Label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <Button
                    type="button"
                    variant={effectiveTheme === "system" ? "default" : "outline"}
                    className="gap-2"
                    onClick={() => handleThemeChange("system")}
                  >
                    <Monitor className="h-4 w-4" />
                    System
                  </Button>
                  <Button
                    type="button"
                    variant={effectiveTheme === "light" ? "default" : "outline"}
                    className="gap-2"
                    onClick={() => handleThemeChange("light")}
                  >
                    <Sun className="h-4 w-4" />
                    Light
                  </Button>
                  <Button
                    type="button"
                    variant={effectiveTheme === "dark" ? "default" : "outline"}
                    className="gap-2"
                    onClick={() => handleThemeChange("dark")}
                  >
                    <Moon className="h-4 w-4" />
                    Dark
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
