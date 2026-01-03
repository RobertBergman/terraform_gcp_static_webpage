import { useParams, Link } from 'react-router-dom';
import recipesData from '../data/recipes.json';
import './RecipeDetail.css';

/**
 * RecipeDetail Component
 * Displays full recipe with ingredients and directions using dark theme
 */
function RecipeDetail() {
  const { id } = useParams();
  const recipe = recipesData.recipes.find((r) => r.id === id);

  if (!recipe) {
    return (
      <div className="recipe-not-found">
        <h1>Recipe not found</h1>
        <Link to="/">← Back to home</Link>
      </div>
    );
  }

  return (
    <div className="recipe-page">
      <header className="recipe-header">
        <Link to="/" className="recipe-back">← Back</Link>
        <button className="recipe-print" onClick={() => window.print()}>Print</button>
        <h1 className="recipe-title">{recipe.title}</h1>
        <p className="recipe-subtitle">{recipe.subtitle}</p>
        <div className="recipe-badge">
          <span className="recipe-dot"></span>
          <span>{recipe.servings}</span>
          {recipe.tags.map((tag, index) => (
            <span key={index}> • {tag}</span>
          ))}
        </div>
      </header>

      <main className="recipe-main">
        <section className="recipe-card recipe-directions">
          <h2>Directions</h2>
          <ol>
            {recipe.directions.map((step, index) => (
              <li key={index}>
                <strong>{step.title}</strong>
                <p>{step.content}</p>
                {step.tip && (
                  <div className="recipe-tip">
                    <strong>Tip:</strong> {step.tip}
                  </div>
                )}
              </li>
            ))}
          </ol>
        </section>

        <aside className="recipe-card recipe-ingredients">
          <h2>Ingredients</h2>
          {Object.entries(recipe.ingredients).map(([category, items]) => (
            <div key={category}>
              <h3>{category}</h3>
              <ul>
                {items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
          <p className="recipe-brisket-note">
            <strong>Brisket note:</strong> If your brisket is smoky/salty, hold back on salt until the end.
          </p>
        </aside>
      </main>

      <footer className="recipe-footer">
        <p><strong>Notes:</strong> {recipe.notes}</p>
      </footer>
    </div>
  );
}

export default RecipeDetail;
