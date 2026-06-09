export enum SkillLevel {
  BEGINNER = 'مبتدئ',
  INTERMEDIATE = 'متوسط',
  PRO = 'حريّف / محترف',
}

export enum PitchType {
  OUTDOOR_TURF = 'نجيل صناعي خارجي - عشب تركي فاخر',
  INDOOR_PRO = 'صالة مغطاة احترافية - فاخر',
  GOLDEN_DOME = 'الملعب الذهبي المضيء - عشب وإضاءة غامرة',
}

export interface Pitch {
  id: string;
  name: string;
  type: PitchType;
  ratePerHour: number;
  rating: number;
  image: string;
  features: string[];
  maxPlayers: number;
}

export interface Booking {
  id: string;
  pitchId: string;
  pitchName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // "14:00"
  duration: number; // in hours, e.g. 1 or 2
  price: number;
  customerName: string;
  customerPhone: string;
  status: 'confirmed' | 'pending';
  isMatchSearch: boolean; // Is it open for others to join?
  joinedPlayers?: string[]; 
}

export interface MatchChallenge {
  id: string;
  title: string;
  pitchName: string;
  date: string;
  time: string;
  creatorName: string;
  creatorPhone: string;
  currentPlayers: number;
  requiredPlayers: number;
  level: SkillLevel;
  joinedUsers: string[];
}

export interface UserLoyalty {
  name: string;
  phone: string;
  completedBookings: number;
  points: number;
  tier: 'الهاوي' | 'المحترف' | 'الكابيتانو';
}
