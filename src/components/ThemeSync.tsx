import { useEffect } from "react";
import { useTheme } from "next-themes";
import { useUserSettings } from "@/hooks/useUserSettings";

export default function ThemeSync() {
  const { settings } = useUserSettings();
  const { setTheme } = useTheme();

  useEffect(() => {
    // Apply the saved theme preference on load
    if (settings.theme) {
      setTheme(settings.theme);
    }
  }, [settings.theme, setTheme]);

  return null;
}
