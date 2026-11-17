import React from 'react';
import { Play, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { KITCHEN_BACKDROP_URL, RECIPES } from '../data/recipes';
import { ChefCoco } from './ChefCoco';
import { DishImage } from './DishImage';

interface SplashScreenProps {
  onStart: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onStart,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col justify-between bg-[#FFFBF5]">
      {/* Sunlit kitchen illustration backdrop with measured scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={KITCHEN_BACKDROP_URL}
          alt="Sunlit cozy kitchen with pastel tiles and wooden counter"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-35"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,251,245,0.88) 0%, rgba(255,251,245,0.72) 50%, rgba(255,244,232,0.95) 100%)',
          }}
        />
      </div>

      {/* Minimal top utility row */}
      <header className="relative z-10 max-w-6xl w-full mx-auto px-5 sm:px-8 pt-5 flex items-center justify-between">
        <span className="font-display font-extrabold text-xl tracking-tight text-[#2D221E] whitespace-nowrap">
          Coco&apos;s Kitchen
        </span>
        <button
          type="button"
          onClick={onToggleSound}
          aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
          className="min-h-[44px] min-w-[44px] px-3.5 py-2 rounded-xl bg-white/90 border border-stone-200 text-stone-700 hover:bg-white hover:text-stone-950 transition-colors flex items-center gap-2 text-sm font-medium shadow-xs focus-visible:outline-2 focus-visible:outline-rose-500"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-rose-600" /> : <VolumeX className="w-4 h-4" />}
          <span className="hidden sm:inline whitespace-nowrap">{soundEnabled ? 'Sound On' : 'Muted'}</span>
        </button>
      </header>

      {/* Main Hero Split */}
      <main className="relative z-10 max-w-6xl w-full mx-auto px-5 sm:px-8 py-6 sm:py-10 flex-1 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center w-full">
          {/* Left Copy + Primary CTA */}
          <div className="lg:col-span-7 text-center lg:text-left flex flex-col items-center lg:items-start">
            <p className="text-sm font-semibold text-rose-600 tracking-wide mb-3">
              Interactive Culinary Kitchen · 4 Real Recipes
            </p>

            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.06] tracking-tight text-[#2D221E] max-w-xl [text-wrap:balance]">
              Master real recipes from pantry to plate.
            </h1>

            <p className="mt-4 text-base sm:text-lg text-stone-600 max-w-lg leading-relaxed">
              Cook alongside Chef Coco in a sunlit modern kitchen. Choose authentic pantry ingredients, avoid flavor-clashing mistakes, and nail every technique from whisking to plating.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <button
                type="button"
                onClick={onStart}
                className="w-full sm:w-auto min-h-[54px] px-8 py-3.5 rounded-2xl bg-[#E11D48] hover:bg-[#BE123C] active:scale-[0.98] text-white font-display font-bold text-lg shadow-lg shadow-rose-500/20 transition-all flex items-center justify-center gap-2.5 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Start Cooking</span>
              </button>

              <span className="text-sm text-stone-500 font-medium flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Real pantry choices · Interactive prep</span>
              </span>
            </div>
          </div>

          {/* Right Animated Kitchen Showcase */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-md flex flex-col items-center">
              {/* Floating mini dish cards around Coco */}
              <div className="grid grid-cols-4 gap-2.5 sm:gap-3 mb-4 w-full">
                {RECIPES.map((recipe, idx) => (
                  <div
                    key={recipe.id}
                    className={`rounded-2xl bg-white p-1.5 shadow-md border border-stone-200/80 ${
                      idx % 2 === 0 ? 'animate-float-slow' : 'animate-float-reverse'
                    }`}
                  >
                    <div className="aspect-square rounded-xl overflow-hidden bg-stone-100">
                      <DishImage
                        src={recipe.imageUrl}
                        alt={recipe.shortTitle}
                        fallbackTitle={recipe.shortTitle}
                        fallbackBg={recipe.themeBg}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="mt-1 text-[11px] font-semibold text-center text-stone-700 truncate px-0.5">
                      {recipe.shortTitle}
                    </p>
                  </div>
                ))}
              </div>

              {/* Chef Coco Hero Welcome */}
              <div className="bg-white/85 backdrop-blur-sm rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-md w-full flex justify-center">
                <ChefCoco
                  mood="excited"
                  size="lg"
                  bubblePosition="top"
                  dialogue="Hey bestie! My apron is on and the counter is spotless. Ready to cook something iconic?"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
