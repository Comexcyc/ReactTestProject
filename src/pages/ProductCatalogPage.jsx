import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import GlobalSearch from "../components/GlobalSearch.jsx";

function ProductCatalogPage({ t, language }) {
  const [catalog, setCatalog] = useState([]);
  const [selectedSeriesId, setSelectedSeriesId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCatalog() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("/api/catalog");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || t.catalog.loadFailed);
        }

        setCatalog(data);
        if (data.length > 0) {
          setSelectedSeriesId(data[0].seriesId);
        }
      } catch (err) {
        setError(err.message || t.catalog.loadFailed);
      } finally {
        setLoading(false);
      }
    }

    loadCatalog();
  }, [t.catalog.loadFailed]);

  const selectedSeries = useMemo(
    () => catalog.find((item) => item.seriesId === selectedSeriesId) ?? null,
    [catalog, selectedSeriesId]
  );

  function seriesLabel(item) {
    if (language === "en" && item.nameEn) {
      return item.nameEn;
    }
    return item.name;
  }

  function typeLabel(type) {
    if (language === "en" && type.descriptionEn) {
      return type.descriptionEn;
    }
    return type.description || type.modelId;
  }

  return (
    <section className="section">
      <div className="container">
        <h3>{t.catalog.title}</h3>
        <p className="catalog-intro">{t.catalog.intro}</p>
        <GlobalSearch t={t} />
        <p className="catalog-search-hint">{t.search.heroHint}</p>

        {loading && <p>{t.catalog.loading}</p>}
        {error && <p className="query-error">{error}</p>}

        {!loading && !error && catalog.length > 0 && (
          <div className="catalog-layout">
            <aside className="catalog-sidebar card">
              <h4>{t.catalog.categories}</h4>
              <ul className="catalog-series-list">
                {catalog.map((item) => (
                  <li key={item.seriesId}>
                    <button
                      type="button"
                      className={
                        item.seriesId === selectedSeriesId
                          ? "catalog-series active"
                          : "catalog-series"
                      }
                      onClick={() => setSelectedSeriesId(item.seriesId)}
                    >
                      <span>{seriesLabel(item)}</span>
                      <small>
                        {item.typeCount} {t.catalog.models}
                      </small>
                    </button>
                  </li>
                ))}
              </ul>
            </aside>

            <div className="catalog-main">
              {selectedSeries && (
                <>
                  <article className="card catalog-summary">
                    <h4>{seriesLabel(selectedSeries)}</h4>
                    {selectedSeries.intro && <p>{selectedSeries.intro}</p>}
                    <div className="catalog-metrics">
                      <span>
                        {t.catalog.modelCount}: {selectedSeries.typeCount}
                      </span>
                      <span>
                        {t.catalog.partCount}: {selectedSeries.productCount}
                      </span>
                    </div>
                  </article>

                  <div className="catalog-type-grid">
                    {selectedSeries.types.map((type) => (
                      <article key={type.modelId} className="card catalog-type-card">
                        <h5>{type.modelId}</h5>
                        <p>{typeLabel(type)}</p>
                        {type.standard && (
                          <p className="catalog-meta">
                            <strong>{t.catalog.standard}:</strong> {type.standard}
                          </p>
                        )}
                        {(type.voltMin !== null || type.voltMax !== null) && (
                          <p className="catalog-meta">
                            <strong>{t.catalog.voltageRange}:</strong>{" "}
                            {type.voltMin ?? "-"}V - {type.voltMax ?? "-"}V
                          </p>
                        )}
                        {(type.capMin !== null || type.capMax !== null) && (
                          <p className="catalog-meta">
                            <strong>{t.catalog.capacitanceRange}:</strong>{" "}
                            {type.capMin ?? "-"}uF - {type.capMax ?? "-"}uF
                          </p>
                        )}
                        <p className="catalog-meta">
                          <strong>{t.catalog.availableParts}:</strong>{" "}
                          {type.productCount}
                        </p>
                        <Link
                          className="btn primary catalog-link"
                          to={`/query?seriesId=${encodeURIComponent(type.modelId)}`}
                        >
                          {t.catalog.viewParts}
                        </Link>
                      </article>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default ProductCatalogPage;
