import { useEffect } from "react";
import { createPortal } from "react-dom";

function ProductDetailDrawer({ open, item, rank, total, context, t, onClose }) {
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open || !item) {
    return null;
  }

  return createPortal(
    <div className="drawer-root" role="presentation">
      <button type="button" className="drawer-backdrop" aria-label={t.query.closeDetail} onClick={onClose} />
      <aside className="drawer-panel" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
        <div className="drawer-header">
          <div>
            <p className="drawer-eyebrow">{t.query.detailTitle}</p>
            <h4 id="drawer-title">{item.partNumber}</h4>
          </div>
          <button type="button" className="drawer-close" onClick={onClose} aria-label={t.query.closeDetail}>
            ×
          </button>
        </div>

        {context && (
          <p className="drawer-breadcrumb">
            {context.category}
            <span aria-hidden="true"> › </span>
            {context.model}
          </p>
        )}

        <p className="drawer-rank">
          {t.query.itemRank
            .replace("{rank}", String(rank))
            .replace("{total}", String(total))}
        </p>

        <dl className="drawer-specs">
          <div>
            <dt>{t.query.columns.seriesId}</dt>
            <dd>{item.seriesId}</dd>
          </div>
          <div>
            <dt>{t.query.columns.description}</dt>
            <dd>{item.description || "-"}</dd>
          </div>
          <div>
            <dt>{t.query.columns.voltage}</dt>
            <dd>{item.ratingVoltage ?? "-"}</dd>
          </div>
          <div>
            <dt>{t.query.columns.capacitance}</dt>
            <dd>{item.capacitance ?? "-"}</dd>
          </div>
          <div>
            <dt>{t.query.columns.esr}</dt>
            <dd>{item.esr ?? "-"}</dd>
          </div>
          {item.tolerance && (
            <div>
              <dt>{t.query.tolerance}</dt>
              <dd>{item.tolerance}</dd>
            </div>
          )}
          {item.caseCode && (
            <div>
              <dt>{t.query.caseCode}</dt>
              <dd>{item.caseCode}</dd>
            </div>
          )}
        </dl>
      </aside>
    </div>,
    document.body
  );
}

export default ProductDetailDrawer;
