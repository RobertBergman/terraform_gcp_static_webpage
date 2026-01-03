/**
 * FeatureCard Component
 * Single Responsibility: Display a single feature card
 * Interface Segregation Principle: Only requires necessary props
 * Liskov Substitution Principle: Can be replaced with variants
 */
function FeatureCard({ title, description, icon, link }) {
  const CardContent = () => (
    <>
      <div className="feature-icon">{icon}</div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
      {link && (
        <a href={link} target="_blank" rel="noopener noreferrer" className="feature-link">
          Learn More →
        </a>
      )}
    </>
  );

  return (
    <div className="feature-card">
      <CardContent />
    </div>
  );
}

export default FeatureCard;
