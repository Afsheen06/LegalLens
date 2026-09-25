export default function ObligationList({ items }) {
  return (
    <div className="content-panel">
      <div className="panel-header">
        <p className="section-kicker">OBLIGATIONS</p>
      </div>

      {items.length ? (
        <ul className="stack-list obligations-list">
          {items.map((item, index) => (
            <li key={`${item}-${index}`} className="stack-item">
              <span className="mini-badge">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="body-copy">No obligations identified.</p>
      )}
    </div>
  );
}
