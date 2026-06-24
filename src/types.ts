export type Team = 'us' | 'opponent';
export type Skill = 'serve' | 'receive' | 'attack' | 'block' | 'dig' | 'set';
export type Quality = 'excellent' | 'good' | 'poor' | 'error';
export type ReceptionQuality = 'A' | 'B' | 'C' | 'Error'; 

export interface Player {
  id: string;
  name: string;
  number: number;
}

export interface Member {
  id: string;
  name: string;
  number: number | '';
  position: string;
  category: string;
  isLibero: boolean;
  tag?: string;
}

export interface RallyEvent {
  id: string;
  team: Team;
  skill: Skill;
  quality: string;
  player?: string;
  timestamp: number;
}

export interface Rally {
  id: string;
  servingTeam: Team;
  rotation: number; // 1-6
  events: RallyEvent[];
  winningTeam: Team;
  ourScore: number;
  opponentScore: number;
}

export interface MatchState {
  id: string;
  ourScore: number;
  opponentScore: number;
  currentServingTeam: Team;
  currentRotation: number; // 1-6
  rallies: Rally[];
  date?: string;
  time?: string;
  venue?: string;
  matchType?: string;
  opponentName?: string;
  starters?: string[];
}
