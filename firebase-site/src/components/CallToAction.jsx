/**
 * CallToAction Component
 * Single Responsibility: Display call-to-action with external link
 * Dependency Inversion Principle: Depends on props abstraction
 */
function CallToAction() {
  const ctaLink = 'https://easyeatsplan.com/';

  return (
    <section className="cta">
      <div className="cta-content">
        <h2 className="cta-title">Fuel Your Adventures</h2>
        <p className="cta-description">
          Check out our meal planning solution designed for active lifestyles
        </p>
        <a
          href={ctaLink}
          target="_blank"
          rel="noopener noreferrer"
          className="cta-button"
        >
          Visit Easy Eats Plan
        </a>
      </div>
    </section>
  );
}

export default CallToAction;
