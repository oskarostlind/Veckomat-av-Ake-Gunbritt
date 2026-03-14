import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import { isValidDayId, getDayColumns, getIngredientsForRecipe } from '../lib/data';
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
      navigate('/', { replace: true });
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
    <>
      <Link
        to={`/dag/${dayId}`}
        className="link-button secondary back-link"
      >
        Tillbaka till {day.label}
      </Link>
      <Link to="/" className="link-button secondary back-link" style={{ marginLeft: '0.5rem' }}>
        Tillbaka till veckan
      </Link>

      <div className="day-view-header">
        <h1>Recept för {day.label} – {day.protein}</h1>
      </div>

      {!hasRecipes ? (
        <div className="empty-state">
          <p>Ingen receptlista – välj en dag och klicka på &quot;Visa recept&quot;.</p>
          <p>Eller så matchade inga recept dina svar. Försök ändra svaren eller välj en annan dag.</p>
          <Link to="/" className="link-button">
            Tillbaka till veckan
          </Link>
        </div>
      ) : (
        <RecipeList
          recipeNames={recipeNames}
          getIngredients={getIngredientsForRecipe}
        />
      )}
    </>
  );
}
