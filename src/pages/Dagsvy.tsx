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
      navigate('/', { replace: true });
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
    <>
      <Link to="/" className="link-button secondary back-link">
        Tillbaka till veckan
      </Link>
      <div className="day-view-header">
        <h1>
          {day.label} – {day.protein}
        </h1>
        <p>Svara gärna på frågorna nedan, eller klicka direkt på &quot;Visa recept&quot; för att se alla recept för denna dag.</p>
      </div>

      {questions.length > 0 && (
        <section className="questions-section">
          <h2>Frågor (valfria)</h2>
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
        className="link-button show-recipes-btn"
        onClick={handleShowRecipes}
      >
        Visa recept
      </button>
    </>
  );
}
