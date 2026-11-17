/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ChevronLeft, Volume2, VolumeX } from 'lucide-react';
import { KITCHEN_BACKDROP_URL, RECIPES } from './data/recipes';
import {
  GameScreen,
  KitchenTool,
  Recipe,
  RecipeId,
  RoundPerformance,
} from './types/game';
import { soundFX } from './utils/sound';
import { SplashScreen } from './components/SplashScreen';
import { RecipeSelect } from './components/RecipeSelect';
import { IngredientPicker } from './components/IngredientPicker';
import { KitchenDrawer } from './components/KitchenDrawer';
import { CookingStage } from './components/CookingStage';
import { ResultScreen } from './components/ResultScreen';

type ExtendedScreen = GameScreen | 'DRAWER';

export default function App() {
  const [screen, setScreen] = useState<ExtendedScreen>('SPLASH');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe>(RECIPES[0]);
  const [selectedTool, setSelectedTool] = useState<KitchenTool | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [ingredientMistakes, setIngredientMistakes] = useState(0);
  const [toolMistakes, setToolMistakes] = useState(0);
  const [roundPerformance, setRoundPerformance] = useState<RoundPerformance | null>(null);
  const [bestStars, setBestStars] = useState<Partial<Record<RecipeId, number>>>({});
  const [roundKey, setRoundKey] = useState(0);

  const toggleSound = () => {
    const next = !soundEnabled;
    soundFX.enabled = next;
    setSoundEnabled(next);
    if (next) soundFX.playPop(580);
  };

  const handleStartCooking = () => {
    soundFX.playGoodPick();
    setScreen('RECIPE_SELECT');
  };

  const handleSelectRecipe = (recipe: Recipe) => {
    soundFX.playPop(540);
    setSelectedRecipe(recipe);
    setSelectedTool(null);
    setIngredientMistakes(0);
    setToolMistakes(0);
    setRoundPerformance(null);
    setRoundKey((k) => k + 1);
    setScreen('INGREDIENTS');
  };

  const handleIngredientsComplete = (mistakes: number) => {
    setIngredientMistakes(mistakes);
    setScreen('DRAWER');
  };

  const handleToolPicked = (tool: KitchenTool, mistakes: number) => {
    setSelectedTool(tool);
    setToolMistakes(mistakes);
    setScreen('COOKING');
  };

  const handleFinishCooking = (perfectTimingSteps: number, totalTimingSteps: number) => {
    const totalMistakes = ingredientMistakes + toolMistakes;
    const pantryScore = Math.max(30, 150 - ingredientMistakes * 40 - toolMistakes * 30);
    const timingRatio = totalTimingSteps > 0 ? perfectTimingSteps / totalTimingSteps : 1;
    const timingScore = Math.round(timingRatio * 150);
    const totalScore = 700 + pantryScore + timingScore;

    let stars: 1 | 2 | 3 = 3;
    if (totalMistakes >= 3 || (totalTimingSteps > 0 && perfectTimingSteps === 0 && totalMistakes >= 1)) {
      stars = 1;
    } else if (totalMistakes > 0 || perfectTimingSteps < totalTimingSteps) {
      stars = 2;
    }

    const perf: RoundPerformance = {
      recipeId: selectedRecipe.id,
      score: totalScore,
      stars,
      ingredientMistakes,
      toolMistakes,
      perfectTimingSteps,
      totalTimingSteps,
    };

    setRoundPerformance(perf);
    setBestStars((prev) => ({
      ...prev,
      [selectedRecipe.id]: Math.max(prev[selectedRecipe.id] ?? 0, stars),
    }));
    setScreen('RESULT');
  };

  const handlePlayAgain = () => {
    setSelectedTool(null);
    setIngredientMistakes(0);
    setToolMistakes(0);
    setRoundPerformance(null);
    setRoundKey((k) => k + 1);
    setScreen('INGREDIENTS');
  };

  const handleBackNavigation = () => {
    soundFX.playPop(420);
    if (screen === 'INGREDIENTS' || screen === 'DRAWER' || screen === 'COOKING' || screen === 'RESULT') {
      setScreen('RECIPE_SELECT');
    } else if (screen === 'RECIPE_SELECT') {
      setScreen('SPLASH');
    }
  };

  if (screen === 'SPLASH') {
    return (
      <SplashScreen
        onStart={handleStartCooking}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
      />
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-[#FFFBF5] text-[#2D221E]">
      {/* Sunlit kitchen environment visible behind all cooking stations */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        <img
          src={KITCHEN_BACKDROP_URL}
          alt=""
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-45"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,251,245,0.72) 0%, rgba(255,248,238,0.62) 60%, rgba(246,227,204,0.78) 100%)',
          }}
        />
      </div>

      {/* Compact Sticky Top Bar */}
      <header className="sticky top-0 z-30 bg-[#FFFBF5]/85 backdrop-blur-md border-b border-stone-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 h-14 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleBackNavigation}
            className="min-h-[44px] px-2.5 -ml-2 rounded-xl text-sm font-semibold text-stone-700 hover:text-stone-950 hover:bg-stone-100/80 transition-colors flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{screen === 'RECIPE_SELECT' ? 'Home' : 'Recipes'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFX.playPop(480);
              setScreen('SPLASH');
            }}
            className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-[#2D221E] whitespace-nowrap shrink-0 cursor-pointer"
          >
            Coco&apos;s Kitchen
          </button>

          <button
            type="button"
            onClick={toggleSound}
            aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            className="min-h-[44px] min-w-[44px] px-3 rounded-xl bg-white/95 border border-stone-200 text-stone-700 hover:bg-white transition-colors flex items-center justify-center gap-1.5 text-xs font-semibold shrink-0 cursor-pointer"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-rose-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-stone-400" />
            )}
            <span className="hidden sm:inline whitespace-nowrap">
              {soundEnabled ? 'Sound On' : 'Muted'}
            </span>
          </button>
        </div>
      </header>

      <main className="relative z-10 flex-1 w-full">
        {screen === 'RECIPE_SELECT' && (
          <RecipeSelect onSelectRecipe={handleSelectRecipe} bestStars={bestStars} />
        )}

        {screen === 'INGREDIENTS' && (
          <IngredientPicker
            key={`ing-${selectedRecipe.id}-${roundKey}`}
            recipe={selectedRecipe}
            onComplete={handleIngredientsComplete}
          />
        )}

        {screen === 'DRAWER' && (
          <KitchenDrawer
            key={`drawer-${selectedRecipe.id}-${roundKey}`}
            recipe={selectedRecipe}
            onToolPicked={handleToolPicked}
          />
        )}

        {screen === 'COOKING' && (
          <CookingStage
            key={`cook-${selectedRecipe.id}-${roundKey}`}
            recipe={selectedRecipe}
            selectedTool={selectedTool}
            onFinishCooking={handleFinishCooking}
          />
        )}

        {screen === 'RESULT' && roundPerformance && (
          <ResultScreen
            recipe={selectedRecipe}
            performance={roundPerformance}
            onPlayAgain={handlePlayAgain}
            onChooseAnother={() => setScreen('RECIPE_SELECT')}
          />
        )}
      </main>
    </div>
  );
}
