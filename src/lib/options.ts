export const DENOMINATIONS = [
  "No preference / Not sure",
  "Baptist",
  "Catholic",
  "Lutheran",
  "Methodist",
  "Presbyterian",
  "Episcopal",
  "Assembly of God",
  "Non-denominational",
  "Other",
] as const;

export const SIZES_REQUIRED = [
  { value: "small", label: "Small (Under 100 members)" },
  { value: "medium", label: "Medium (100–500 members)" },
  { value: "large", label: "Large (Over 500 members)" },
] as const;

export const SIZES_OPTIONAL = [
  { value: "", label: "No preference" },
  ...SIZES_REQUIRED,
] as const;

export const LOCATIONS = [
  "State College",
  "Bellefonte",
  "Pleasant Gap",
  "Boalsburg",
  "Lemont",
  "Pine Grove Mills",
] as const;
