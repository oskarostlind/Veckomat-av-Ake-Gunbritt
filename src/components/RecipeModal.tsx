import type { RecipeInstruction } from '../lib/data';

type Props = {
  recipeName: string;
  ingredients: string[];
  instruction: RecipeInstruction | null;
  onClose: () => void;
};

const difficultyLabel: Record<string, string> = {
  enkel: 'Enkel',
  medel: 'Medel',
  avancerad: 'Avancerad',
};

export default function RecipeModal({ recipeName, ingredients, instruction, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="recipe-modal-title"
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 overflow-y-auto flex-1">
          <h2 id="recipe-modal-title" className="text-xl font-bold text-stone-800 mt-0 mb-4">
            {recipeName}
          </h2>

          <section className="mb-5">
            <h3 className="text-lg font-semibold text-stone-700 mb-2">Ingredienser</h3>
            {ingredients.length > 0 ? (
              <ul className="list-disc pl-5 text-stone-600 text-lg space-y-1">
                {ingredients.map((ing) => (
                  <li key={ing}>{ing}</li>
                ))}
              </ul>
            ) : (
              <p className="text-stone-500 text-lg m-0">Inga ingredienser angivna.</p>
            )}
          </section>

          {instruction && (
            <section>
              <h3 className="text-lg font-semibold text-stone-700 mb-2">Tillagning</h3>
              <div className="space-y-3 text-stone-600 text-lg">
                {(instruction.prepTime != null || instruction.cookTime != null || instruction.totalTime != null || instruction.difficulty) && (
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-base">
                    {instruction.prepTime != null && (
                      <span>Förberedelse: {instruction.prepTime} min</span>
                    )}
                    {instruction.cookTime != null && (
                      <span>Tillagning: {instruction.cookTime} min</span>
                    )}
                    {instruction.totalTime != null && (
                      <span>Totalt: {instruction.totalTime} min</span>
                    )}
                    {instruction.difficulty && (
                      <span>Svårighet: {difficultyLabel[instruction.difficulty] ?? instruction.difficulty}</span>
                    )}
                  </div>
                )}
                {instruction.steps.length > 0 && (
                  <ol className="list-decimal pl-6 space-y-2 m-0">
                    {instruction.steps.map((step, i) => (
                      <li key={i} className="pl-1">{step}</li>
                    ))}
                  </ol>
                )}
              </div>
            </section>
          )}
        </div>

        <div className="p-4 border-t border-stone-200">
          <button
            type="button"
            onClick={onClose}
            className="w-full min-h-[48px] px-4 py-3 text-lg font-medium text-amber-50 bg-amber-800 rounded-lg hover:bg-amber-900 transition-colors"
          >
            Stäng
          </button>
        </div>
      </div>
    </div>
  );
}
