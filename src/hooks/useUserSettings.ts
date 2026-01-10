import { useEffect, useMemo, useState } from "react";
import { NO_PREFERENCE_VALUE } from "@/lib/options";

const STORAGE_KEY = "faith_finder_user_settings_v2";

export type UserSettings = {
  denomination: string;
  size: string;
  worshipStyle: string;
  location: string;
  distance: string;
  priorities: string[];
  additionalInfo: string;
};

const DEFAULT_SETTINGS: UserSettings = {
  denomination: NO_PREFERENCE_VALUE,
  size: "",
  worshipStyle: NO_PREFERENCE_VALUE,
  location: "Centre County",
  distance: NO_PREFERENCE_VALUE,
  priorities: [],
  additionalInfo: "",
};

function safeParse(raw: string | null): any | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function coerceSettings(input: any): UserSettings {
  const s = input ?? {};

  return {
    denomination:
      typeof s.denomination === "string" && s.denomination.length > 0
        ? s.denomination
        : DEFAULT_SETTINGS.denomination,

    size: typeof s.size === "string" ? s.size : DEFAULT_SETTINGS.size,

    worshipStyle:
      typeof s.worshipStyle === "string" && s.worshipStyle.length > 0
        ? s.worshipStyle
        : DEFAULT_SETTINGS.worshipStyle,

    location:
      typeof s.location === "string" && s.location.length > 0
        ? s.location
        : DEFAULT_SETTINGS.location,

    distance:
      typeof s.distance === "string" && s.distance.length > 0
        ? s.distance
        : DEFAULT_SETTINGS.distance,

    priorities: Array.isArray(s.priorities)
      ? s.priorities.filter((x: any) => typeof x === "string")
      : DEFAULT_SETTINGS.priorities,

    additionalInfo:
      typeof s.additionalInfo === "string" ? s.additionalInfo : DEFAULT_SETTINGS.additionalInfo,
  };
}

export function useUserSettings() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = safeParse(raw);
    const coerced = coerceSettings(parsed);
    setSettings(coerced);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [loaded, settings]);

  const apiSettings = useMemo(() => {
    // When sending to the backend, convert "no-preference" to ""
    return {
      ...settings,
      denomination: settings.denomination === NO_PREFERENCE_VALUE ? "" : settings.denomination,
      worshipStyle: settings.worshipStyle === NO_PREFERENCE_VALUE ? "" : settings.worshipStyle,
      distance: settings.distance === NO_PREFERENCE_VALUE ? "" : settings.distance,
      priorities: Array.isArray(settings.priorities) ? settings.priorities : [],
    };
  }, [settings]);

  const reset = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    settings,
    setSettings,
    apiSettings,
    reset,
    loaded,
  };
}
