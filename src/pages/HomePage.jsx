import { NavLink } from "react-router-dom";
import HeroBackground from "../components/HeroBackground.jsx";
import ScrollReveal from "../components/ScrollReveal.jsx";

function HomePage({ t }) {
  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-content">
            <p className="eyebrow">{t.hero.eyebrow}</p>
            <h2>{t.hero.title}</h2>
            <p>{t.hero.body}</p>
            <div className="hero-actions">
              <NavLink to="/about#contact" className="btn primary">
                {t.hero.primaryBtn}
              </NavLink>
              <NavLink to="/products" className="btn ghost">
                {t.hero.secondaryBtn}
              </NavLink>
            </div>
          </div>
          <HeroBackground labels={t.hero.visualTags} />
        </div>
      </section>

      <ScrollReveal>
        <section className="section home-business">
          <div className="container">
            <h3 className="section-heading">{t.home.focusTitle}</h3>
            <p className="home-lead">{t.home.lead}</p>
            <div className="home-focus-grid">
              {t.home.focusItems.map((item) => (
                <div key={item.title} className="home-focus-item">
                  <h4>{item.title}</h4>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
            <div className="home-actions">
              <NavLink to="/products" className="btn primary">
                {t.home.productsBtn}
              </NavLink>
              <NavLink to="/about" className="btn ghost">
                {t.home.aboutBtn}
              </NavLink>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </>
  );
}

export default HomePage;
