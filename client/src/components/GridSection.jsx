import { useState } from "react";

export default function GridSection({
  title,
  subtitle,
  items,
  loading,
  renderItem,
  initialCount = 8
}) {
  const [showAll, setShowAll] = useState(false);

  const visibleItems = showAll
    ? items
    : items.slice(0, initialCount);

  return (
    <div className="grid-section">
      <div className="grid-header">
        <div>
          <div className="section-title">{title}</div>
          <div className="section-sub">{subtitle}</div>
        </div>
      </div>

      <div className="swiggy-grid">
        {loading
          ? [...Array(initialCount)].map((_, i) => (
              <div key={i} className="skeleton swiggy-skeleton" />
            ))
          : visibleItems.map((item) => (
              <div key={item._id}>
                {renderItem(item)}
              </div>
            ))}
      </div>

      {!loading && items.length > initialCount && (
        <div className="show-more-wrap">
          <button
            className="show-more-btn"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show Less" : "Show More"}
          </button>
        </div>
      )}
    </div>
  );
}