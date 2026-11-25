import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import GlobalSearch from "../components/GlobalSearch.jsx";
import ProductDetailDrawer from "../components/ProductDetailDrawer.jsx";
import { CatalogSkeleton, TableSkeleton } from "../components/Skeleton.jsx";

const PAGE_SIZE = 100;

const emptyForm = {
  keyword: "",
  seriesId: "",
  capMin: "",
  capMax: "",
  voltMin: "",
  voltMax: ""
};

function buildFormFromParams(searchParams) {
  const quickQuery =
    searchParams.get("keyword") ??
    searchParams.get("q") ??
    searchParams.get("partNumber") ??
    "";
  return {
    ...emptyForm,
    seriesId: searchParams.get("seriesId") ?? "",
    keyword: quickQuery
  };
}

function ProductCatalogPage({ t, language }) {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const searchSectionRef = useRef(null);

  useEffect(() => {
    const targetId = location.hash.replace(/^#/, "");
    if (!targetId) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);

    return () => window.clearTimeout(timer);
  }, [location.hash]);
  const [catalog, setCatalog] = useState([]);
  const [selectedSeriesId, setSelectedSeriesId] = useState(null);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState("");
  const [form, setForm] = useState(() => buildFormFromParams(searchParams));
  const [series, setSeries] = useState([]);
  const [result, setResult] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  const totalPages = useMemo(() => {
    if (!result || result.total === 0) {
      return 0;
    }
    return Math.ceil(result.total / PAGE_SIZE);
  }, [result]);

  const runSearch = useCallback(
    async (nextForm, { page = 1, scrollToResults = false } = {}) => {
      setSearchLoading(true);
      setSearchError("");
      setSelectedRow(null);
      setCurrentPage(page);

      const params = new URLSearchParams();
      Object.entries(nextForm).forEach(([key, value]) => {
        if (value !== "") {
          params.set(key, value);
        }
      });
      params.set("limit", String(PAGE_SIZE));
      params.set("offset", String((page - 1) * PAGE_SIZE));

      try {
        const response = await fetch(`/api/products/search?${params.toString()}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || t.query.searchFailed);
        }

        setResult(data);

        if (scrollToResults) {
          searchSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } catch (err) {
        setResult(null);
        setSearchError(err.message || t.query.searchFailed);
      } finally {
        setSearchLoading(false);
      }
    },
    [t.query.searchFailed]
  );

  function goToPage(page) {
    if (searchLoading || !result || page < 1 || page > totalPages) {
      return;
    }

    runSearch(form, { page });
  }

  useEffect(() => {
    async function loadCatalog() {
      setCatalogLoading(true);
      setCatalogError("");

      try {
        const [catalogRes, seriesRes] = await Promise.all([
          fetch("/api/catalog"),
          fetch("/api/series")
        ]);
        const catalogData = await catalogRes.json();

        if (!catalogRes.ok) {
          throw new Error(catalogData.error || t.catalog.loadFailed);
        }

        setCatalog(catalogData);
        if (catalogData.length > 0) {
          setSelectedSeriesId(catalogData[0].seriesId);
        }

        if (seriesRes.ok) {
          setSeries(await seriesRes.json());
        }
      } catch (err) {
        setCatalogError(err.message || t.catalog.loadFailed);
      } finally {
        setCatalogLoading(false);
      }
    }

    loadCatalog();
  }, [t.catalog.loadFailed]);

  useEffect(() => {
    const nextForm = buildFormFromParams(searchParams);
    setForm(nextForm);

    if (nextForm.keyword || nextForm.seriesId) {
      runSearch(nextForm, { page: 1, scrollToResults: true });
    }
  }, [searchParams, runSearch]);

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

  const modelContextMap = useMemo(() => {
    const map = new Map();

    for (const seriesItem of catalog) {
      for (const type of seriesItem.types || []) {
        map.set(type.modelId.toLowerCase(), {
          category: seriesLabel(seriesItem),
          model: `${type.modelId} · ${typeLabel(type)}`
        });
      }
    }

    return map;
  }, [catalog, language]);

  function getModelContext(modelId) {
    if (!modelId) {
      return null;
    }

    return modelContextMap.get(String(modelId).toLowerCase()) ?? null;
  }

  const activeSearchContext = useMemo(() => {
    if (form.seriesId) {
      return (
        getModelContext(form.seriesId) ?? {
          category: form.seriesId,
          model: form.seriesId
        }
      );
    }

    if (form.keyword && result?.items?.[0]?.seriesId) {
      return getModelContext(result.items[0].seriesId);
    }

    return null;
  }, [form.keyword, form.seriesId, result?.items, modelContextMap]);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleQuickSearch(value) {
    const nextForm = { ...emptyForm, keyword: value };
    setForm(nextForm);
    runSearch(nextForm, { page: 1, scrollToResults: true });
  }

  function handleTypeSearch(modelId) {
    const nextForm = { ...emptyForm, seriesId: modelId };
    setForm(nextForm);
    runSearch(nextForm, { page: 1, scrollToResults: true });
  }

  async function handleSearch(event) {
    event.preventDefault();
    await runSearch(form, { page: 1, scrollToResults: true });
  }

  function handleReset() {
    setForm(emptyForm);
    setResult(null);
    setCurrentPage(1);
    setSelectedRow(null);
    setSearchError("");
  }

  function formatPageOf(current, total) {
    return t.query.pageOf
      .replace("{current}", String(current))
      .replace("{total}", String(total));
  }

  function handleRowSelect(item, index) {
    setSelectedRow({
      item,
      index,
      rank: (currentPage - 1) * PAGE_SIZE + index + 1
    });
  }

  return (
    <section className="section products-page">
      <div className="container">
        <header className="products-header">
          <h3 className="section-heading">{t.catalog.title}</h3>
          <p className="catalog-intro">{t.catalog.intro}</p>
          <nav className="products-jump" aria-label={t.catalog.jumpLabel}>
            <a href="#product-lines">{t.catalog.linesTitle}</a>
            <a href="#hybrid-series">{t.sections.hybridSeries}</a>
            <a href="#catalog-browse">{t.catalog.browseTitle}</a>
          </nav>
        </header>

        <div id="product-lines" className="product-block">
          <h4 className="product-block-title">{t.catalog.linesTitle}</h4>
          <div className="grid">
            {t.products.map((product) => (
              <article key={product.name} className="card">
                <h4>{product.name}</h4>
                <p>{product.description}</p>
              </article>
            ))}
          </div>
        </div>

        <div id="hybrid-series" className="product-block">
          <h4 className="product-block-title">{t.sections.hybridSeries}</h4>
          <p className="hybrid-overview">{t.hybridSeries.overview}</p>
          <ul className="hybrid-highlights">
            {t.hybridSeries.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <article className="card hybrid-table-card">
            <h5>{t.hybridSeries.tableTitle}</h5>
            <div className="table-wrap">
              <table className="spec-table">
                <thead>
                  <tr>
                    <th>{t.hybridSeries.columns.model}</th>
                    <th>{t.hybridSeries.columns.capacitance}</th>
                    <th>{t.hybridSeries.columns.voltage}</th>
                    <th>{t.hybridSeries.columns.temp}</th>
                    <th>{t.hybridSeries.columns.note}</th>
                  </tr>
                </thead>
                <tbody>
                  {t.hybridSeries.rows.map((row) => (
                    <tr key={row.model}>
                      <td>{row.model}</td>
                      <td>{row.capacitance}</td>
                      <td>{row.voltage}</td>
                      <td>{row.temp}</td>
                      <td>{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </div>

        <div id="catalog-browse" className="product-block" ref={searchSectionRef}>
          <h4 className="product-block-title">{t.catalog.browseTitle}</h4>
          <p className="catalog-intro">{t.catalog.browseIntro}</p>
          <GlobalSearch t={t} onSearch={handleQuickSearch} />
          <p className="catalog-search-hint">{t.search.heroHint}</p>

        {catalogLoading && <CatalogSkeleton />}
        {catalogError && <p className="query-error">{catalogError}</p>}

        {!catalogLoading && !catalogError && catalog.length > 0 && (
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
                        <button
                          type="button"
                          className="btn primary catalog-link"
                          onClick={() => handleTypeSearch(type.modelId)}
                        >
                          {t.catalog.viewParts}
                        </button>
                      </article>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <div className="catalog-search-section">
          <h5 className="catalog-advanced-title">{t.query.title}</h5>
          <p className="query-intro">{t.query.intro}</p>

          <form className="query-form card" onSubmit={handleSearch}>
            <div className="query-grid">
              <label>
                {t.query.keyword}
                <input
                  value={form.keyword}
                  onChange={(e) => updateField("keyword", e.target.value)}
                  placeholder={t.query.keywordPlaceholder}
                />
              </label>
              <label>
                {t.query.seriesId}
                <input
                  value={form.seriesId}
                  onChange={(e) => updateField("seriesId", e.target.value)}
                  placeholder="THQ1"
                  list="series-options"
                />
                <datalist id="series-options">
                  {series.map((item) => (
                    <option key={item.seriesId} value={item.name} />
                  ))}
                </datalist>
              </label>
              <label>
                {t.query.capMin}
                <input
                  type="number"
                  value={form.capMin}
                  onChange={(e) => updateField("capMin", e.target.value)}
                  placeholder="1000"
                />
              </label>
              <label>
                {t.query.capMax}
                <input
                  type="number"
                  value={form.capMax}
                  onChange={(e) => updateField("capMax", e.target.value)}
                  placeholder="220000"
                />
              </label>
              <label>
                {t.query.voltMin}
                <input
                  type="number"
                  value={form.voltMin}
                  onChange={(e) => updateField("voltMin", e.target.value)}
                  placeholder="10"
                />
              </label>
              <label>
                {t.query.voltMax}
                <input
                  type="number"
                  value={form.voltMax}
                  onChange={(e) => updateField("voltMax", e.target.value)}
                  placeholder="150"
                />
              </label>
            </div>

            <div className="query-actions">
              <button className="btn primary" type="submit" disabled={searchLoading}>
                {searchLoading ? t.query.searching : t.query.search}
              </button>
              <button className="btn ghost" type="button" onClick={handleReset}>
                {t.query.reset}
              </button>
            </div>
          </form>

          {searchError && <p className="query-error">{searchError}</p>}

          {searchLoading && !result && <TableSkeleton rows={10} />}

          {result && (
            <article className="card query-results">
              <div className="query-summary-row">
                <p className="query-summary">
                  {t.query.found}: <strong>{result.total}</strong>
                </p>
                {totalPages > 0 && (
                  <p className="query-page-indicator">
                    <strong>{formatPageOf(currentPage, totalPages)}</strong>
                  </p>
                )}
              </div>

              {activeSearchContext && (
                <p className="query-breadcrumb">
                  <span className="query-breadcrumb-label">{t.query.searchContext}</span>
                  {activeSearchContext.category}
                  <span aria-hidden="true"> › </span>
                  {activeSearchContext.model}
                </p>
              )}

              {selectedRow && (
                <p className="query-row-selected">
                  {t.query.selectedItem}:{" "}
                  <strong>
                    {t.query.itemRank
                      .replace("{rank}", String(selectedRow.rank))
                      .replace("{total}", String(result.total))}
                  </strong>
                  <span className="query-row-part"> · {selectedRow.item.partNumber}</span>
                </p>
              )}

              <div className="table-wrap results-scroll">
                {searchLoading ? (
                  <TableSkeleton rows={10} />
                ) : (
                  <table className="spec-table">
                    <thead>
                      <tr>
                        <th>{t.query.columns.partNumber}</th>
                        <th>{t.query.columns.seriesId}</th>
                        <th>{t.query.columns.description}</th>
                        <th>{t.query.columns.voltage}</th>
                        <th>{t.query.columns.capacitance}</th>
                        <th>{t.query.columns.esr}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.items.length === 0 ? (
                        <tr>
                          <td colSpan="6">{t.query.noResults}</td>
                        </tr>
                      ) : (
                        result.items.map((item, index) => (
                          <tr
                            key={`${item.partNumber}-${item.seriesId}-${index}`}
                            className={
                              selectedRow?.index === index
                                ? "result-row selected"
                                : "result-row"
                            }
                            onClick={() => handleRowSelect(item, index)}
                          >
                            <td>{item.partNumber}</td>
                            <td>{item.seriesId}</td>
                            <td>{item.description}</td>
                            <td>{item.ratingVoltage ?? "-"}</td>
                            <td>{item.capacitance ?? "-"}</td>
                            <td>{item.esr ?? "-"}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>

              {totalPages > 1 && (
                <div className="query-pagination">
                  <button
                    type="button"
                    className="btn ghost"
                    disabled={currentPage <= 1 || searchLoading}
                    onClick={() => goToPage(currentPage - 1)}
                  >
                    {t.query.prevPage}
                  </button>
                  <span className="query-pagination-status">
                    {formatPageOf(currentPage, totalPages)}
                  </span>
                  <button
                    type="button"
                    className="btn ghost"
                    disabled={currentPage >= totalPages || searchLoading}
                    onClick={() => goToPage(currentPage + 1)}
                  >
                    {t.query.nextPage}
                  </button>
                </div>
              )}
            </article>
          )}

          <ProductDetailDrawer
            open={Boolean(selectedRow)}
            item={selectedRow?.item ?? null}
            rank={selectedRow?.rank ?? 0}
            total={result?.total ?? 0}
            context={
              selectedRow ? getModelContext(selectedRow.item.seriesId) : null
            }
            t={t}
            onClose={() => setSelectedRow(null)}
          />
        </div>
        </div>
      </div>
    </section>
  );
}

export default ProductCatalogPage;
