import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import { isValidDayId, getDayColumns, getIngredientsForRecipe, getRecipeInstruction } from '../lib/data';
import RecipeList from '../components/RecipeList';

const RECEPTVAL_STORAGE_KEY = 'veckomat-receptval';

type ReceptvalState = { recipeNames?: string[]; dayId?: string };

export default function Receptval() {
  const { dayId } = useParams<{ dayId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as ReceptvalState | null;
  const [recipeNames, setRecipeNames] = useState<string[]>(() => state?.recipeNames ?? []);

  const validDay = dayId && isValidDayId(dayId);
  const dayColumns = getDayColumns();
  const day = dayColumns.find((c) => c.id === dayId);

  useEffect(() => {
    if (dayId && !isValidDayId(dayId)) {
      navigate('/vecka', { replace: true });
      return;
    }
    const fromState = state?.recipeNames;
    if (fromState?.length) return;
    try {
      const raw = sessionStorage.getItem(RECEPTVAL_STORAGE_KEY);
      if (raw) {
        const { recipeNames: stored, dayId: storedDayId } = JSON.parse(raw);
        if (storedDayId === dayId && Array.isArray(stored)) {
          setRecipeNames(stored);
        }
      }
    } catch {
      // ignore
    }
  }, [dayId, navigate, state?.recipeNames]);

  if (!validDay || !day) {
    return null;
  }

  const hasRecipes = recipeNames.length > 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          to={`/dag/${dayId}`}
          className="inline-flex items-center min-h-[48px] px-4 py-2 text-lg text-stone-700 bg-stone-200 rounded-lg hover:bg-stone-300 no-underline"
        >
          Tillbaka till {day.label}
        </Link>
        <Link
          to="/vecka"
          className="inline-flex items-center min-h-[48px] px-4 py-2 text-lg text-stone-600 rounded-lg hover:bg-stone-100 no-underline"
        >
          Veckan
        </Link>
        <Link
          to="/"
          className="inline-flex items-center min-h-[48px] px-4 py-2 text-lg text-stone-600 rounded-lg hover:bg-stone-100 no-underline"
        >
          Startsida
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-stone-800 mb-6">
        Recept för {day.label} – {day.protein}
      </h1>

      {!hasRecipes ? (
        <div className="text-center py-8 px-4 bg-white rounded-xl border border-stone-200">
          <p className="text-lg text-stone-700 mb-2">
            Ingen receptlista – välj en dag och klicka på &quot;Visa recept&quot;.
          </p>
          <p className="text-lg text-stone-600 mb-4">
            Eller så matchade inga recept dina svar. Försök ändra svaren eller välj en annan dag.
          </p>
          <Link
            to="/vecka"
            className="inline-flex items-center min-h-[48px] px-6 py-3 text-lg font-medium text-amber-50 bg-amber-800 rounded-lg hover:bg-amber-900 no-underline"
          >
            Tillbaka till veckan
          </Link>
        </div>
      ) : (
        <RecipeList
          recipeNames={recipeNames}
          getIngredients={getIngredientsForRecipe}
          getInstruction={getRecipeInstruction}
        />
      )}
    </div>
  );
}
