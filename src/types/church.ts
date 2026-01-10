// Church-related types
export interface Church {
  id: string;
  name: string;
  denomination: string;
  size: 'small' | 'medium' | 'large';
  address: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  website: string | null;
  description: string | null;
  created_at: string | null;
  updated_at: string | null;
}

// Search and matching types
export interface SearchParams {
  denomination?: string;
  size: 'small' | 'medium' | 'large';
  worshipStyle?: string;
  location: string;
  distance?: string;
  priorities: string[];
  additionalInfo?: string;
}

export interface MatchReason {
  category: 'denomination' | 'size' | 'worship' | 'location' | 'priorities' | 'other';
  text: string;
  weight: number;
}

export interface MatchResult {
  church: Church;
  matchScore: number;
  matchReasons: string[];
  detailedReasons?: MatchReason[];
  rank: number;
  distance?: number;
}

export interface SearchResponse {
  topMatch: MatchResult | null;
  runnerUps: MatchResult[];
  totalMatches: number;
  searchCriteria: SearchParams;
  processingTime?: number;
}
