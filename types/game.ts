export type GameScreen = 'SPLASH' | 'RECIPE_SELECT' | 'INGREDIENTS' | 'COOKING' | 'RESULT';

export type RecipeId = 'cake' | 'sandwich' | 'juice' | 'dates';

export type ChefMood = 'idle' | 'happy' | 'excited' | 'oops' | 'cooking' | 'proud';

export type CookingMechanic = 'tap' | 'hold' | 'timing' | 'layer';

export interface KitchenTool {
  id: string;
  name: string;
  emoji: string;
  subtitle: string;
  accentColor: string;
}

export interface Ingredient {
  id: string;
  name: string;
  emoji: string;
  isCorrect: boolean;
  reactionLine: string;
  errorTitle?: string;
  accentColor: string;
}

export interface CookingStep {
  id: string;
  title: string;
  instruction: string;
  actionLabel: string;
  tapFeedbackWord?: string;
  mechanic: CookingMechanic;
  targetCount?: number;
  layerItems?: string[];
  cocoLineStart: string;
  cocoLineDone: string;
  toolName: string;
}

export interface Recipe {
  id: RecipeId;
  title: string;
  shortTitle: string;
  category: string;
  prepTime: string;
  tagline: string;
  imageUrl: string;
  themeBg: string;
  themeAccent: string;
  requiredToolId: string;
  toolPrompt: string;
  introLine: string;
  ingredientsPrompt: string;
  ingredients: Ingredient[];
  steps: CookingStep[];
  resultPraise: {
    threeStars: string;
    twoStars: string;
    oneStar: string;
  };
}

export interface RoundPerformance {
  recipeId: RecipeId;
  score: number;
  stars: 1 | 2 | 3;
  ingredientMistakes: number;
  toolMistakes: number;
  perfectTimingSteps: number;
  totalTimingSteps: number;
}
