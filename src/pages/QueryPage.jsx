import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const emptyForm = {
  partNumber: "",
  seriesId: "",
  capMin: "",
  capMax: "",
  voltMin: "",
  voltMax: ""
};

function buildFormFromParams(searchParams) {
  const quickQuery = searchParams.get("q") ?? "";
  return {
    ...emptyForm,
    seriesId: searchParams.get("seriesId") ?? "",
    partNumber: searchParams.get("partNumber") ?? quickQuery
  };
}

function QueryPage({ t }) {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState(() => buildFormFromParams(searchParams));
  const [series, setSeries] = useState([]);
  const [status, setStatus] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const runSearch = useCallback(
    async (nextForm) => {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();
      Object.entries(nextForm).forEach(([key, value]) => {
        if (value !== "") {
          params.set(key, value);
        }
      });
      params.set("limit", "50");

      try {
        const response = await fetch(`/api/products/search?${params.toString()}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || t.query.searchFailed);
        }

        setResult(data);
      } catch (err) {
        setResult(null);
        setError(err.message || t.query.searchFailed);
      } finally {
        setLoading(false);
      }
    },
    [t.query.searchFailed]
  );

  useEffect(() => {
    async function loadMeta() {
      try {
        const [statusRes, seriesRes] = await Promise.all([
          fetch("/api/mdb/status"),
          fetch("/api/series")
        ]);

        if (statusRes.ok) {
          setStatus(await statusRes.json());
        }

        if (seriesRes.ok) {
          setSeries(await seriesRes.json());
        }
      } catch {
        setError(t.query.apiUnavailable);
      }
    }

    loadMeta();
  }, [t.query.apiUnavailable]);

  useEffect(() => {
    const nextForm = buildFormFromParams(searchParams);
    setForm(nextForm);

    if (nextForm.partNumber || nextForm.seriesId) {
      runSearch(nextForm);
    }
  }, [searchParams, runSearch]);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSearch(event) {
    event.preventDefault();
    await runSearch(form);
  }

  function handleReset() {
    setForm(emptyForm);
    setResult(null);
    setError("");
  }

  return (
    <section className="section">
      <div className="container">
        <h3>{t.query.title}</h3>
        <p className="query-intro">{t.query.intro}</p>

        {status && (
          <article className="card query-status">
            <p>
              <strong>{t.query.source}:</strong> {status.file}
            </p>
            <p>
              <strong>{t.query.records}:</strong> {status.productCount}
            </p>
            <p>
              <strong>{t.query.updated}:</strong>{" "}
              {new Date(status.lastModified).toLocaleString()}
            </p>
          </article>
        )}

        <form className="query-form card" onSubmit={handleSearch}>
          <div className="query-grid">
            <label>
              {t.query.partNumber}
              <input
                value={form.partNumber}
                onChange={(e) => updateField("partNumber", e.target.value)}
                placeholder="THQ1"
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
            <button className="btn primary" type="submit" disabled={loading}>
              {loading ? t.query.searching : t.query.search}
            </button>
            <button className="btn ghost" type="button" onClick={handleReset}>
              {t.query.reset}
            </button>
          </div>
        </form>

        {error && <p className="query-error">{error}</p>}

        {result && (
          <article className="card">
            <p className="query-summary">
              {t.query.found}: <strong>{result.total}</strong>
            </p>
            <div className="table-wrap">
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
                    result.items.map((item) => (
                      <tr key={`${item.partNumber}-${item.description}`}>
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
            </div>
          </article>
        )}
      </div>
    </section>
  );
}

export default QueryPage;
