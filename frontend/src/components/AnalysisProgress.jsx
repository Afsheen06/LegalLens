export default function AnalysisProgress({ selectedFile }) {
  const stages = [
    'DOCUMENT INGESTED',
    'TEXT EXTRACTED',
    'CLAUSES IDENTIFIED',
    'OBLIGATIONS MAPPED',
    'REVIEW POINTS PREPARED'
  ];

  return (
    <section className="progress-shell" id="results-section">
      <div className="progress-content">
        <p className="section-kicker">CASE FILE</p>
        <h2>AI is analyzing your document...</h2>

        <div className="progress-list" aria-label="Analysis progress steps">
          {stages.map((stage, index) => (
            <div
              key={stage}
              className={index === 0 ? 'progress-step is-current' : 'progress-step is-complete'}
            >
              <span className="progress-index">{String(index + 1).padStart(2, '0')}</span>
              <span className="progress-label">{stage}</span>
            </div>
          ))}
        </div>

        <p className="progress-file">{selectedFile?.name || 'Document'}</p>
      </div>
    </section>
  );
}
