import { useEffect, useState } from "react";

function TrustBar({ t }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await fetch("/api/mdb/status");
        if (response.ok) {
          setStats(await response.json());
        }
      } catch {
        setStats(null);
      }
    }

    loadStats();
  }, []);

  const items = [
    {
      value: stats ? stats.productCount.toLocaleString() : "18,000+",
      label: t.trust.parts
    },
    {
      value: stats ? String(stats.seriesCount) : "14",
      label: t.trust.categories
    },
    {
      value: t.trust.certValue,
      label: t.trust.cert
    },
    {
      value: t.trust.industryValue,
      label: t.trust.industry
    }
  ];

  return (
    <section className="trust-bar" aria-label={t.trust.ariaLabel}>
      <div className="container trust-bar-inner">
        {items.map((item) => (
          <div key={item.label} className="trust-bar-item">
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TrustBar;
