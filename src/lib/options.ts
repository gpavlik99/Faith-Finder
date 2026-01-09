/**
 * Centralized option lists used across the app.
 * This file intentionally exports BOTH the new names and legacy aliases
 * so older pages (like Settings.tsx) continue to build.
 */

export type Option = {
  value: string;
  label: string;
};

/**
 * IMPORTANT: Radix/shadcn SelectItem cannot use value="".
 * Use this token for "No preference" / "clear" selections in Select controls.
 */
export const NO_PREFERENCE_VALUE = "no-preference";

/**
 * Denominations
 */
export const DENOMINATION_OPTIONS: Option[] = [
  { value: NO_PREFERENCE_VALUE, label: "No preference" },
  { value: "Catholic", label: "Catholic" },
  { value: "Protestant", label: "Protestant" },
  { value: "Non-denominational", label: "Non-denominational" },
  { value: "Orthodox", label: "Orthodox" },
];

/**
 * LEGACY ALIAS (used by Settings.tsx)
 */
export const DENOMINATIONS: Option[] = DENOMINATION_OPTIONS;

/**
 * Church sizes
 */
export const CHURCH_SIZES: Option[] = [
  { value: "small", label: "Small (tight-knit community)" },
  { value: "medium", label: "Medium (balanced size)" },
  { value: "large", label: "Large (many programs & groups)" },
];

/**
 * Legacy optional sizes list (cannot include value="")
 */
export const SIZES_OPTIONAL: Option[] = [
  { value: NO_PREFERENCE_VALUE, label: "No preference" },
  ...CHURCH_SIZES,
];

/**
 * Worship styles
 */
export const WORSHIP_STYLES: Option[] = [
  { value: NO_PREFERENCE_VALUE, label: "No preference" },
  { value: "traditional", label: "Traditional (hymns / liturgy)" },
  { value: "contemporary", label: "Contemporary (modern music)" },
  { value: "blended", label: "Blended (mix of both)" },
  { value: "charismatic", label: "Charismatic (expressive worship)" },
  { value: "quiet", label: "Quiet / contemplative" },
];

/**
 * Distance options (miles)
 * Values must be strings for Select controls.
 */
export const DISTANCE_OPTIONS_MILES: Option[] = [
  { value: NO_PREFERENCE_VALUE, label: "No preference" },
  { value: "5", label: "Within 5 miles" },
  { value: "10", label: "Within 10 miles" },
  { value: "15", label: "Within 15 miles" },
  { value: "25", label: "Within 25 miles" },
  { value: "50", label: "Within 50 miles" },
];

/**
 * Priorities
 */
export const PRIORITY_OPTIONS: Option[] = [
  { value: "kids", label: "Kids / Family" },
  { value: "youth", label: "Youth / Teens" },
  { value: "community", label: "Community involvement" },
  { value: "missions", label: "Missions / Global outreach" },
  { value: "small-groups", label: "Small groups" },
  { value: "service", label: "Serving opportunities" },
  { value: "accessibility", label: "Accessibility" },
  { value: "music", label: "Music / Worship" },
  { value: "teaching", label: "Teaching / Sermons" },
  { value: "quiet", label: "Quiet / Reflective" },
];

/**
 * Locations
 */
export const LOCATION_OPTIONS: Option[] = [
  { value: "Centre County", label: "Centre County, PA" },
  { value: "State College", label: "State College, PA" },
  { value: "Bellefonte", label: "Bellefonte, PA" },
  { value: "Boalsburg", label: "Boalsburg, PA" },
  { value: "Penns Valley", label: "Penns Valley, PA" },
];

/**
 * LEGACY ALIAS (used by Settings.tsx)
 */
export const LOCATIONS: Option[] = LOCATION_OPTIONS;

