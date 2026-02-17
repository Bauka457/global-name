
export type MarkerType = 'tower' | 'pyramid' | 'mountain' | 'monument' | 'temple' | 'modern' | 'nature' | 'capital';

export interface Question {
  id: number;
  locationName: string;
  lat: number;
  lng: number;
  question: string;
  options: string[];
  correctIndex: number;
  hint: string;
  markerType: MarkerType;
}

export type GameState = 'intro' | 'playing' | 'results';

export interface QuizProgress {
  answered: number[];
  score: number;
  currentQuestion: Question | null;
}

// Interface for planet data used in SolarSystem component
export interface Planet {
  name: string;
  color: string;
  distance: number;
  size: number;
  speed: number;
  rings?: boolean;
}
