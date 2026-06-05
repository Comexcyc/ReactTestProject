import { useState } from "react";
import { useNavigate } from "react-router-dom";

function GlobalSearch({ t }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    const value = query.trim();
    if (!value) {
      return;
    }

    navigate(`/query?q=${encodeURIComponent(value)}`);
  }

  return (
    <form
      className="catalog-search"
      onSubmit={handleSubmit}
      role="search"
    >
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t.search.placeholder}
        aria-label={t.search.placeholder}
      />
      <button className="btn primary" type="submit">
        {t.search.button}
      </button>
    </form>
  );
}

export default GlobalSearch;
