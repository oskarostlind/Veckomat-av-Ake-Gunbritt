import { useState } from 'react';
import RecipeModal from './RecipeModal';
import type { RecipeInstruction } from '../lib/data';

type Props = {
  recipeNames: string[];
  getIngredients: (name: string) => string[];
  getInstruction?: (name: string) => RecipeInstruction | null;
};

export default function RecipeList({ recipeNames, getIngredients, getInstruction }: Props) {
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);

  return (
    <>
      <ul className="list-none p-0 m-0 space-y-3">
        {recipeNames.map((name) => (
          <li
            key={name}
            role="button"
            tabIndex={0}
            onClick={() => setSelectedRecipe(name)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setSelectedRecipe(name);
              }
            }}
            className="bg-white border border-stone-200 rounded-lg p-4 shadow-sm cursor-pointer hover:border-amber-300 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
          >
            <h3 className="text-lg font-semibold text-stone-800 m-0">
              {name}
            </h3>
            <p className="text-amber-800 text-base mt-2 m-0 font-medium">
              Klicka för att se recept
            </p>
          </li>
        ))}
      </ul>

      {selectedRecipe && (
        <RecipeModal
          recipeName={selectedRecipe}
          ingredients={getIngredients(selectedRecipe)}
          instruction={getInstruction?.(selectedRecipe) ?? null}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </>
  );
}
