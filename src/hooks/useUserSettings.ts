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

function safeGetItem(key: string): string | null {
  try {
    if (typeof window === "undefined" || !window.localStorage) return null;
    return window.localStorage.getItem(key);
  } catch {
    // Some environments (privacy modes, blocked storage, etc.) can throw.
    return null;
  }
}

function safeSetItem(key: string, value: string) {
  try {
    if (typeof window === "undefined" || !window.localStorage) return;
    window.localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

export function getStoredUserSettings(): UserSettings {
  const parsed = safeParse(safeGetItem(STORAGE_KEY));
  return {
    ...USER_SETTINGS_DEFAULTS,
    ...(parsed ?? {}),
  };
}

export function setStoredUserSettings(next: UserSettings) {
  safeSetItem(STORAGE_KEY, JSON.stringify(next));
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
