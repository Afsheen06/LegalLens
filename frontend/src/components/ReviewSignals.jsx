export default function ReviewSignals({ items }) {
  return (
    <div className="content-panel review-panel">
      <div className="panel-header">
        <p className="section-kicker">AREAS TO REVIEW</p>
      </div>

      {items.length ? (
        <ul className="stack-list review-list">
          {items.map((item, index) => (
            <li key={`${item}-${index}`} className="stack-item review-item">
              <span className="review-mark">Points for further review</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="body-copy">No notable areas to review identified.</p>
      )}
    </div>
  );
}
