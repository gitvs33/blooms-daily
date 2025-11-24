export enum AppPhase {
  SELECTION = 'SELECTION',
  GROWING = 'GROWING',
  DILEMMA = 'DILEMMA',
  QUESTION_LIKE_LOVE = 'QUESTION_LIKE_LOVE',
  LOVE_LESSON = 'LOVE_LESSON',
  BROKEN = 'BROKEN',
  GENERATION = 'GENERATION', // Was PENALTY
  REWARD = 'REWARD'
}

export interface FlowerData {
  month: string;
  name: string;
  meaning: string;
  color: string;
  textColor: string;
  petalColor: string; // Tailwind text color class, e.g. "text-pink-300"
  centerColor: string; // Tailwind text color class, e.g. "text-yellow-400"
}

export interface MonthData {
  id: number;
  name: string;
  flowerId: string;
}