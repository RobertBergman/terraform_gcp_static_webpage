import { Link } from 'react-router-dom';
import recipesData from '../data/recipes.json';

/**
 * Recipes Component
 * Single Responsibility: Display recipe cards linking to full recipes
 */
function Recipes() {
  const { recipes } = recipesData;

  return (
    <section className="recipes">
      <div className="recipes-container">
        <h2 className="section-title">Recipes</h2>
        <p className="recipes-intro">
          Delicious recipes to enjoy at home or on your next adventure.
        </p>
        <div className="recipes-grid">
          {recipes.map((recipe) => (
            <Link
              key={recipe.id}
              to={`/recipes/${recipe.id}`}
              className="recipe-card-link"
            >
              <article className="recipe-preview-card">
                <div className="recipe-preview-content">
                  <h3 className="recipe-preview-title">{recipe.title}</h3>
                  <p className="recipe-preview-description">{recipe.subtitle}</p>
                  <div className="recipe-preview-meta">
                    <span className="recipe-preview-servings">{recipe.servings}</span>
                    <div className="recipe-preview-tags">
                      {recipe.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="recipe-preview-tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <span className="recipe-preview-cta">View Recipe →</span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Recipes;
