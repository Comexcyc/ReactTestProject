function HeroBackground({ labels = [] }) {
  return (
    <figure className="hero-visual">
      <div className="hero-visual-panel">
        <img
          src="/images/hero-earth.jpg"
          alt=""
          className="hero-visual-photo"
          loading="eager"
          decoding="async"
        />
        <div className="hero-visual-overlay" aria-hidden="true" />
        {labels.length > 0 && (
          <figcaption className="hero-visual-tags">
            {labels.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </figcaption>
        )}
      </div>
    </figure>
  );
}

export default HeroBackground;
