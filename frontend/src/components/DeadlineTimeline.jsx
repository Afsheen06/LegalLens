export default function DeadlineTimeline({ items }) {
  return (
    <div className="content-panel">
      <div className="panel-header">
        <p className="section-kicker">DEADLINES & TIMING</p>
      </div>

      {items.length ? (
        <ul className="timeline-list">
          {items.map((item, index) => (
            <li key={`${item}-${index}`} className="timeline-item">
              <span className="timeline-dot" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="body-copy">No specific dates or deadlines found.</p>
      )}
    </div>
  );
}
