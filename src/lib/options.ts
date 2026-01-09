/**
 * Centralized option lists used across the app.
 * Keep these exports stable so components can import reliably.
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
 * Denomination options (optional question in the form)
 * Keep this list modest to start; you can expand later.
 */
export const DENOMINATION_OPTIONS: Option[] = [
  { value: NO_PREFERENCE_VALUE, label: "No preference" },
  { value: "Catholic", label: "Catholic" },
  { value: "Protestant", label: "Protestant" },
  { value: "Non-denominational", label: "Non-denominational" },
  { value: "Orthodox", label: "Orthodox" },
];

/**
 * Church size options (required)
 */
export const CHURCH_SIZES: Option[] = [
  { value: "small", label: "Small (tight-knit community)" },
  { value: "medium", label: "Medium (balanced size)" },
  { value: "large", label: "Large (many programs & groups)" },
];

/**
 * Backwards compatibility: some older code may import SIZES_OPTIONAL.
 * Keep it exported, but DO NOT include value="" (Radix disallows it).
 */
export const SIZES_OPTIONAL: Option[] = [
  { value: NO_PREFERENCE_VALUE, label: "No preference" },
  ...CHURCH_SIZES,
];

/**
 * Worship style options (optional)
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
 * Distance options in miles (optional)
 * Values are strings because Select values must be strings.
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
 * Priorities (optional) - shown as selectable pills
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
 * Optional: common location labels for dropdowns (if you want to reuse).
 * Your SearchForm currently hardcodes locations, so this is here for future use.
 */
export const LOCATION_OPTIONS: Option[] = [
  { value: "Centre County", label: "Centre County, PA" },
  { value: "State College", label: "State College, PA" },
  { value: "Bellefonte", label: "Bellefonte, PA" },
  { value: "Boalsburg", label: "Boalsburg, PA" },
  { value: "Penns Valley", label: "Penns Valley, PA" },
];

