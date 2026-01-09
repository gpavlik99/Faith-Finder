export type Option = { value: string; label: string };

export const NO_PREFERENCE_VALUE = "no-preference";

/** Legacy + current exports (kept for compatibility) */
export const DENOMINATION_OPTIONS: Option[] = [
  { value: NO_PREFERENCE_VALUE, label: "No preference" },
  { value: "Baptist", label: "Baptist" },
  { value: "Catholic", label: "Catholic" },
  { value: "Lutheran", label: "Lutheran" },
  { value: "Methodist", label: "Methodist" },
  { value: "Presbyterian", label: "Presbyterian" },
  { value: "Episcopal/Anglican", label: "Episcopal / Anglican" },
  { value: "Orthodox", label: "Orthodox" },
  { value: "Pentecostal/Charismatic", label: "Pentecostal / Charismatic" },
  { value: "Non-denominational", label: "Non-denominational" },
  { value: "Church of Christ", label: "Church of Christ" },
  { value: "Nazarene", label: "Nazarene" },
  { value: "Adventist", label: "Seventh-day Adventist" },
  { value: "Reformed", label: "Reformed" },
];
export const DENOMINATIONS: Option[] = DENOMINATION_OPTIONS;

export const WORSHIP_STYLES: Option[] = [
  { value: NO_PREFERENCE_VALUE, label: "No preference" },
  { value: "traditional", label: "Traditional (hymns / liturgy)" },
  { value: "contemporary", label: "Contemporary (modern music)" },
  { value: "blended", label: "Blended (mix of both)" },
  { value: "charismatic", label: "Charismatic (expressive worship)" },
  { value: "quiet", label: "Quiet / contemplative" },
];

export const DISTANCE_OPTIONS_MILES: Option[] = [
  { value: NO_PREFERENCE_VALUE, label: "No preference" },
  { value: "5", label: "Within 5 miles" },
  { value: "10", label: "Within 10 miles" },
  { value: "15", label: "Within 15 miles" },
  { value: "25", label: "Within 25 miles" },
  { value: "50", label: "Within 50 miles" },
];

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

/** Legacy exports used in Settings.tsx */
export const LOCATION_OPTIONS: Option[] = [
  { value: "Centre County", label: "Centre County, PA" },
  { value: "State College", label: "State College, PA" },
  { value: "Bellefonte", label: "Bellefonte, PA" },
  { value: "Boalsburg", label: "Boalsburg, PA" },
  { value: "Penns Valley", label: "Penns Valley, PA" },
];
export const LOCATIONS: Option[] = LOCATION_OPTIONS;

/** Legacy size options used by Settings.tsx (no empty string values) */
export const CHURCH_SIZES: Option[] = [
  { value: "small", label: "Small (1–100 people)" },
  { value: "medium", label: "Medium (101–500 people)" },
  { value: "large", label: "Large (500+ people)" },
];
export const SIZES_OPTIONAL: Option[] = [
  { value: NO_PREFERENCE_VALUE, label: "No preference" },
  ...CHURCH_SIZES,
];
