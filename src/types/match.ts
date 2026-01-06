export interface ChurchMatch {
  id: string;
  name: string;
  denomination: string;
  size: string;
  location: string;
  address: string;
  description: string;
  latitude: number;
  longitude: number;
  phone?: string | null;
  website?: string | null;
  reason?: string;
}

export interface MatchResults {
  bestMatch: ChurchMatch;
  runnerUps: ChurchMatch[];
}
