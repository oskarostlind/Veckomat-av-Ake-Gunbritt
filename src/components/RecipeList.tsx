type Props = {
  recipeNames: string[];
  getIngredients: (name: string) => string[];
};

export default function RecipeList({ recipeNames, getIngredients }: Props) {
  return (
    <ul className="recipe-list">
      {recipeNames.map((name) => {
        const ingredients = getIngredients(name);
        return (
          <li key={name} className="recipe-item">
            <h3>{name}</h3>
            {ingredients.length > 0 && (
              <div className="ingredients">
                <strong>Ingredienser:</strong>
                <ul>
                  {ingredients.map((ing) => (
                    <li key={ing}>{ing}</li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
