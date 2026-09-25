export default function ClauseMap({ clauses }) {
  return (
    <div className="content-panel">
      <div className="panel-header">
        <p className="section-kicker">CLAUSE MAP</p>
      </div>

      {clauses.length ? (
        <ol className="clause-list">
          {clauses.map((item, index) => (
            <li key={`${item}-${index}`} className="clause-item">
              <span className="clause-number">{String(index + 1).padStart(2, '0')}</span>
              <div className="clause-copy">
                <strong>{item.split(':')[0] || `SECTION ${index + 1}`}</strong>
                <p>{item.includes(':') ? item.split(':').slice(1).join(':').trim() : item}</p>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className="body-copy">No specific clauses identified.</p>
      )}
    </div>
  );
}
