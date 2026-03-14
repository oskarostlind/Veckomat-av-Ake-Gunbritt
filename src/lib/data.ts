import veckomatData from '../data/veckomat.json';

const MAX_RECIPES_PER_DAY = 15;

export type DayColumn = { id: string; label: string; protein: string };
export type Question = 
  | { id: string; type: 'yesno'; text: string; filterKey: string; forProteins?: string[] }
  | { id: string; type: 'multichoice'; text: string; options: string[]; filterKey: string; forProteins?: string[] };
export type Difficulty = 'enkel' | 'medel' | 'avancerad';
export type Recipe = { id: string; name: string; protein: string; difficulty?: Difficulty; [key: string]: unknown };

export type RecipeInstruction = {
  prepTime?: number;
  cookTime?: number;
  totalTime?: number;
  difficulty?: Difficulty;
  steps: string[];
};

const { dayColumns, recipeGrid, recipeIngredients, recipeInstructions, questions, recipes } = veckomatData as {
  dayColumns: DayColumn[];
  recipeGrid: string[][];
  recipeIngredients: Record<string, string[]>;
  recipeInstructions?: Record<string, string | RecipeInstruction>;
  questions: Question[];
  recipes: Recipe[];
};

function normalizeInstruction(raw: string | RecipeInstruction | undefined): RecipeInstruction | null {
  if (raw == null) return null;
  if (typeof raw === 'string') {
    return raw.trim() ? { steps: [raw.trim()] } : null;
  }
  if (Array.isArray(raw.steps) && raw.steps.length > 0) return raw;
  return null;
}

export function getDayColumns(): DayColumn[] {
  return dayColumns;
}

export function getRecipeGrid(): string[][] {
  return recipeGrid;
}

export function getRecipeIngredients(): Record<string, string[]> {
  return recipeIngredients;
}

export function getQuestions(): Question[] {
  return questions;
}

/** Returns questions relevant for the given protein (day type). Use forProteins: ["Fisk"] to show only on fish days, ["all"] or omit to show everywhere. */
export function getQuestionsForProtein(protein: string): Question[] {
  return questions.filter((q) => {
    const forProteins = q.forProteins;
    if (!forProteins || forProteins.length === 0) return true;
    if (forProteins.includes('all')) return true;
    return forProteins.includes(protein);
  });
}

export function getRecipes(): Recipe[] {
  return recipes;
}

/** Returns recipe names for a day column from the grid (non-empty cells only). */
export function getRecipesForDay(dayId: string): string[] {
  const colIndex = dayColumns.findIndex((c) => c.id === dayId);
  if (colIndex < 0) return [];
  const names: string[] = [];
  for (const row of recipeGrid) {
    const cell = row[colIndex];
    if (cell && String(cell).trim() !== '') {
      names.push(String(cell).trim());
    }
  }
  return names;
}

/** Get day column id for today (0 = Sunday -> son, 1 = Monday -> man, ...). Reserv is not a weekday. */
export function getTodayDayId(): string | null {
  const dayMap: Record<number, string> = {
    0: 'son',
    1: 'man',
    2: 'tis',
    3: 'ons',
    4: 'tor',
    5: 'fre',
    6: 'lor',
  };
  return dayMap[new Date().getDay()] ?? null;
}

const recipeByName = new Map(recipes.map((r) => [r.name, r]));

/**
 * Returns up to 15 recipes for the given day.
 * If answers is empty or not provided, returns all recipes for the day (sliced to 15).
 * If answers are provided, filters day recipes by matching recipe filter fields; recipes
 * that exist in the grid but not in the recipes list are always included (so table works without full data).
 */
export function filterRecipes(
  dayId: string,
  answers: Record<string, boolean | string> = {}
): string[] {
  const dayRecipes = getRecipesForDay(dayId);
  if (Object.keys(answers).length === 0) {
    return dayRecipes.slice(0, MAX_RECIPES_PER_DAY);
  }
  const filtered: string[] = [];
  for (const name of dayRecipes) {
    const recipe = recipeByName.get(name);
    if (!recipe) {
      filtered.push(name);
      continue;
    }
    let match = true;
    for (const [key, value] of Object.entries(answers)) {
      if (value === undefined || value === null || value === '') continue;
      const recipeVal = recipe[key];
      if (recipeVal !== value) {
        match = false;
        break;
      }
    }
    if (match) filtered.push(name);
  }
  return filtered.slice(0, MAX_RECIPES_PER_DAY);
}

export function getIngredientsForRecipe(recipeName: string): string[] {
  return recipeIngredients[recipeName] ?? [];
}

/** Returns structured instructions for a recipe (times, difficulty, steps), or null. Supports both legacy string and new object format in JSON. */
export function getRecipeInstruction(recipeName: string): RecipeInstruction | null {
  return normalizeInstruction(recipeInstructions?.[recipeName]);
}

export function isValidDayId(dayId: string): boolean {
  return dayColumns.some((c) => c.id === dayId);
}
