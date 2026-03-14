import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getQuestionsForProtein,
  filterRecipes,
} from '../lib/data';
import QuestionStep from './QuestionStep';

const RECEPTVAL_STORAGE_KEY = 'veckomat-receptval';

type Props = {
  open: boolean;
  onClose: () => void;
  todayId: string;
  todayProtein: string;
  dayLabel: string;
};

export default function ValjAtMigModal({
  open,
  onClose,
  todayId,
  todayProtein,
  dayLabel,
}: Props) {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, boolean | string>>({});
  const questions = getQuestionsForProtein(todayProtein);

  const handleVisaRecept = () => {
    const recipeNames = filterRecipes(todayId, answers);
    const payload = { dayId: todayId, recipeNames, timestamp: Date.now() };
    sessionStorage.setItem(RECEPTVAL_STORAGE_KEY, JSON.stringify(payload));
    onClose();
    navigate(`/dag/${todayId}/recept`, { state: { recipeNames, dayId: todayId } });
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="valj-at-mig-title"
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 overflow-y-auto flex-1">
          <h2 id="valj-at-mig-title" className="text-xl font-bold text-stone-800 mt-0 mb-2">
            Välj åt mig – {dayLabel} ({todayProtein})
          </h2>
          <p className="text-stone-600 text-base mb-6 m-0">
            Svara på frågorna nedan så väljer vi recept som passar. Alla frågor är valfria.
          </p>

          {questions.length > 0 ? (
            <div className="space-y-4">
              {questions.map((q) => (
                <QuestionStep
                  key={q.id}
                  question={q}
                  value={answers[q.filterKey]}
                  onChange={(value) => setAnswers((prev) => ({ ...prev, [q.filterKey]: value }))}
                />
              ))}
            </div>
          ) : (
            <p className="text-stone-600 mb-4">Inga frågor för denna dag – klicka på Visa recept för att se alla recept.</p>
          )}
        </div>

        <div className="p-4 border-t border-stone-200 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 min-h-[48px] px-4 py-3 text-lg font-medium text-stone-700 bg-stone-200 rounded-lg hover:bg-stone-300 transition-colors"
          >
            Avbryt
          </button>
          <button
            type="button"
            onClick={handleVisaRecept}
            className="flex-1 min-h-[48px] px-4 py-3 text-lg font-medium text-amber-50 bg-amber-800 rounded-lg hover:bg-amber-900 transition-colors"
          >
            Visa recept
          </button>
        </div>
      </div>
    </div>
  );
}
