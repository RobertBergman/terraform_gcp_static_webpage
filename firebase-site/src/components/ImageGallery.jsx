/**
 * ImageGallery Component
 * Single Responsibility: Display a responsive gallery of Washington wine country images
 * Features: Red Mountain Vineyards, #2 Canyon, and Kiona Vineyard wines
 */
function ImageGallery() {
  const images = [
    {
      id: 1,
      src: '/images/2canyon.jpg',
      alt: '#2 Canyon in Wenatchee - Mountain biking trails and scenic views',
      title: '#2 Canyon, Wenatchee',
      description: 'Epic mountain biking trails through stunning landscapes',
    },
    {
      id: 2,
      src: '/images/kiona.jpeg',
      alt: 'Kiona Vineyard wine bottles from Red Mountain',
      title: 'Kiona Vineyard Wines',
      description: 'Award-winning wines from Red Mountain AVA',
    },
  ];

  return (
    <section className="gallery">
      <div className="gallery-container">
        <h2 className="section-title">Explore Wine Country</h2>
        <p className="gallery-intro">
          From the legendary Red Mountain vineyards to the thrilling trails of
          #2 Canyon in Wenatchee, discover the beauty and adventure of
          Washington Wine Country.
        </p>
        <div className="gallery-grid">
          {images.map((image) => (
            <div key={image.id} className="gallery-item">
              <div className="gallery-image-wrapper">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="gallery-image"
                  loading="lazy"
                />
                <div className="gallery-overlay">
                  <h3 className="gallery-title">{image.title}</h3>
                  <p className="gallery-description">{image.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ImageGallery;
