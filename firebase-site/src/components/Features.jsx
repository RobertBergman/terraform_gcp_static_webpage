import FeatureCard from './FeatureCard';

/**
 * Features Component
 * Single Responsibility: Display feature cards
 * Open/Closed Principle: Extensible through adding more features
 */
function Features() {
  const features = [
    {
      id: 1,
      title: 'Washington Wine Country',
      description:
        'Nestled in the heart of Washington\'s stunning wine region, where rolling vineyards meet breathtaking landscapes. Experience world-class wines and the beauty of the Pacific Northwest.',
      icon: '🍷🍾',
      link: 'https://kionawine.com/',
    },
    {
      id: 2,
      title: 'Mountain Biking Paradise',
      description:
        'Epic trails wind through diverse terrain, from high-desert sagebrush to pine forests. Whether you\'re a seasoned rider or just starting out, the trails here offer adventure for everyone.',
      icon: '🚵',
      link: 'https://www.evergreenmtb.org/',
    },
  ];

  return (
    <section className="features">
      <div className="features-container">
        <h2 className="section-title">Where Adventure Meets Elegance</h2>
        <div className="features-grid">
          {features.map((feature) => (
            <FeatureCard key={feature.id} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
