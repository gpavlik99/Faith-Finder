import { useCallback, useMemo, useState } from "react";

export type AppTheme = "system" | "light" | "dark";

export type UserSettings = {
  defaultLocation: string;
  defaultSize: string;
  defaultDenomination: string;
  theme: AppTheme;
};

const STORAGE_KEY = "FAITH_FINDER_SETTINGS_V1";

export const USER_SETTINGS_DEFAULTS: UserSettings = {
  defaultLocation: "State College",
  defaultSize: "",
  defaultDenomination: "No preference / Not sure",
  theme: "system",
};

function safeParse(raw: string | null): Partial<UserSettings> | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;
    return parsed as Partial<UserSettings>;
  } catch {
    return null;
  }
}

export function getStoredUserSettings(): UserSettings {
  const parsed = safeParse(localStorage.getItem(STORAGE_KEY));
  return {
    ...USER_SETTINGS_DEFAULTS,
    ...(parsed ?? {}),
  };
}

export function setStoredUserSettings(next: UserSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function useUserSettings() {
  const [settings, setSettings] = useState<UserSettings>(() => getStoredUserSettings());

  const update = useCallback((patch: Partial<UserSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      setStoredUserSettings(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setStoredUserSettings(USER_SETTINGS_DEFAULTS);
    setSettings(USER_SETTINGS_DEFAULTS);
  }, []);

  const api = useMemo(
    () => ({ settings, update, reset }),
    [settings, update, reset]
  );

  return api;
}
