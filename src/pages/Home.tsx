import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getTodayDayId, getDayColumns, getRecipesForDay, getIngredientsForRecipe, getRecipeInstruction } from '../lib/data';
import RecipeList from '../components/RecipeList';
import ValjAtMigModal from '../components/ValjAtMigModal';

const dayNames: Record<string, string> = {
  man: 'Måndag',
  tis: 'Tisdag',
  ons: 'Onsdag',
  tor: 'Torsdag',
  fre: 'Fredag',
  lor: 'Lördag',
  son: 'Söndag',
  reserv: 'Reserv',
};

export default function Home() {
  const [valjAtMigOpen, setValjAtMigOpen] = useState(false);
  const todayId = getTodayDayId();
  const dayColumns = getDayColumns();
  const day = todayId ? dayColumns.find((c) => c.id === todayId) : null;
  const todayRecipes = todayId ? getRecipesForDay(todayId).slice(0, 15) : [];
  const dayLabel = day ? dayNames[day.id] ?? day.label : null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <header className="text-center pb-6 border-b-2 border-stone-200">
        <h1 className="text-2xl md:text-3xl font-bold text-stone-800 m-0">
          Veckomat
        </h1>
        <p className="text-amber-800 mt-2 text-lg m-0">
          Recept och veckoplan från Gun-Britt &amp; Åke
        </p>
      </header>

      <section className="py-8">
        <h2 className="text-xl font-semibold text-stone-800 mb-2">
          Dagens recept
          {dayLabel && (
            <span className="font-normal text-stone-600 ml-2">
              – {dayLabel} ({day?.protein})
            </span>
          )}
        </h2>
        {todayRecipes.length > 0 ? (
          <>
            <p className="text-stone-600 mb-4 text-lg">
              Här är recepten för idag. Vill du välja en annan dag eller se hela veckan kan du klicka nedan.
            </p>
            <RecipeList
              recipeNames={todayRecipes}
              getIngredients={getIngredientsForRecipe}
              getInstruction={getRecipeInstruction}
            />
          </>
        ) : (
          <p className="text-stone-600 text-lg">
            Inga recept är kopplade till idag. Klicka på &quot;Se veckans mat&quot; för att välja dag.
          </p>
        )}
      </section>

      <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row gap-3">
        {todayId && day && (
          <button
            type="button"
            onClick={() => setValjAtMigOpen(true)}
            className="inline-flex items-center justify-center min-h-[48px] px-6 py-3 text-lg font-medium text-amber-900 bg-amber-100 border-2 border-amber-400 rounded-lg hover:bg-amber-200 transition-colors"
          >
            Välj åt mig
          </button>
        )}
        <Link
          to="/vecka"
          className="inline-flex items-center justify-center min-h-[48px] px-6 py-3 text-lg font-medium text-amber-50 bg-amber-800 rounded-lg hover:bg-amber-900 transition-colors no-underline"
        >
          Se veckans mat
        </Link>
      </div>

      {todayId && day && (
        <ValjAtMigModal
          open={valjAtMigOpen}
          onClose={() => setValjAtMigOpen(false)}
          todayId={todayId}
          todayProtein={day.protein}
          dayLabel={dayLabel ?? day.label}
        />
      )}
    </div>
  );
}
