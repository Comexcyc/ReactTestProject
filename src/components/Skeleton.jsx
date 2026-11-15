function Skeleton({ className = "", rows = 1 }) {
  if (rows <= 1) {
    return <div className={`skeleton ${className}`.trim()} aria-hidden="true" />;
  }

  return (
    <div className={`skeleton-stack ${className}`.trim()} aria-hidden="true">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="skeleton" />
      ))}
    </div>
  );
}

export function CatalogSkeleton() {
  return (
    <div className="catalog-skeleton" aria-hidden="true">
      <div className="catalog-skeleton-sidebar">
        <Skeleton className="skeleton-title" />
        <Skeleton rows={6} />
      </div>
      <div className="catalog-skeleton-main">
        <Skeleton className="skeleton-card" />
        <div className="catalog-skeleton-grid">
          <Skeleton className="skeleton-card" />
          <Skeleton className="skeleton-card" />
          <Skeleton className="skeleton-card" />
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 8 }) {
  return (
    <div className="table-skeleton" aria-hidden="true">
      <Skeleton className="skeleton-line short" />
      {Array.from({ length: rows }, (_, index) => (
        <Skeleton key={index} className="skeleton-line" />
      ))}
    </div>
  );
}

export default Skeleton;
