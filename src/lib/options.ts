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

export const WORSHIP_STYLES = [
  "No preference / Not sure",
  "Traditional",
  "Contemporary",
  "Blended",
  "Liturgical",
  "Charismatic",
] as const;

export const DISTANCE_OPTIONS_MILES = [
  { value: "5", label: "Within 5 miles" },
  { value: "10", label: "Within 10 miles" },
  { value: "15", label: "Within 15 miles" },
  { value: "25", label: "Within 25 miles" },
  { value: "50", label: "Within 50 miles" },
  { value: "", label: "No preference" },
] as const;

export const PRIORITY_OPTIONS = [
  "Strong kids / youth programs",
  "Small groups / community",
  "Serving the local community",
  "Global missions / outreach",
  "Music & worship experience",
  "Bible study / teaching",
  "Welcoming to newcomers",
  "Accessibility (mobility, hearing, etc.)",
] as const;
