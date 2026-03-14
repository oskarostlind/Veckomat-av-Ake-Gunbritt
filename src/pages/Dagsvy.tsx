import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  getDayColumns,
  getQuestions,
  filterRecipes,
  isValidDayId,
} from '../lib/data';
import QuestionStep from '../components/QuestionStep';

const RECEPTVAL_STORAGE_KEY = 'veckomat-receptval';

export default function Dagsvy() {
  const { dayId } = useParams<{ dayId: string }>();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, boolean | string>>({});

  const valid = dayId && isValidDayId(dayId);
  const dayColumns = getDayColumns();
  const day = dayColumns.find((c) => c.id === dayId);
  const questions = getQuestions();

  useEffect(() => {
    if (dayId && !isValidDayId(dayId)) {
      navigate('/vecka', { replace: true });
    }
  }, [dayId, navigate]);

  const setAnswer = (key: string, value: boolean | string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleShowRecipes = () => {
    if (!dayId) return;
    const recipeNames = filterRecipes(dayId, answers);
    const payload = { dayId, recipeNames, timestamp: Date.now() };
    sessionStorage.setItem(RECEPTVAL_STORAGE_KEY, JSON.stringify(payload));
    navigate(`/dag/${dayId}/recept`, { state: { recipeNames, dayId } });
  };

  if (!valid || !day) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          to="/vecka"
          className="inline-flex items-center min-h-[48px] px-4 py-2 text-lg text-stone-700 bg-stone-200 rounded-lg hover:bg-stone-300 no-underline"
        >
          Tillbaka till veckan
        </Link>
        <Link
          to="/"
          className="inline-flex items-center min-h-[48px] px-4 py-2 text-lg text-stone-600 rounded-lg hover:bg-stone-100 no-underline"
        >
          Startsida
        </Link>
      </div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-800 m-0 mb-1">
          {day.label} – {day.protein}
        </h1>
        <p className="text-stone-600 text-lg m-0">
          Svara gärna på frågorna nedan, eller klicka direkt på &quot;Visa recept&quot; för att se alla recept för denna dag.
        </p>
      </div>

      {questions.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-stone-800 mb-4">Frågor (valfria)</h2>
          {questions.map((q) => (
            <QuestionStep
              key={q.id}
              question={q}
              value={answers[q.filterKey]}
              onChange={(value) => setAnswer(q.filterKey, value)}
            />
          ))}
        </section>
      )}

      <button
        type="button"
        className="min-h-[48px] px-6 py-3 text-lg font-medium text-amber-50 bg-amber-800 rounded-lg hover:bg-amber-900 transition-colors"
        onClick={handleShowRecipes}
      >
        Visa recept
      </button>
    </div>
  );
}
