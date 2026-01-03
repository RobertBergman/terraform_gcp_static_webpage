/**
 * Hero Component
 * Single Responsibility: Display the main hero section with branding
 */
function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">Fatesblind</h1>
        <p className="hero-subtitle">
          Living the adventure in Washington Wine Country
        </p>
      </div>
    </section>
  );
}

export default Hero;
