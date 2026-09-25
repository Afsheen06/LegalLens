export default function CompareWorkspace({
  documentA,
  documentB,
  onSelectDocumentA,
  onSelectDocumentB,
  onCompare,
  isComparing,
  result
}) {
  const formatFileSize = (file) => {
    if (!file) return '';
    const size = file.size;
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const renderFileCard = (label, file, onSelect) => (
    <label className="compare-card">
      <p className="compare-label">{label}</p>
      <input type="file" accept=".pdf,.docx" onChange={(event) => onSelect(event.target.files[0])} />

      {file ? (
        <div className="compare-file-info">
          <span className="compare-file-name">{file.name}</span>
          <span className="compare-file-meta">
            {file.name.toLowerCase().endsWith('.pdf') ? 'PDF' : 'DOCX'} · {formatFileSize(file)}
          </span>
        </div>
      ) : (
        <span className="upload-mini">Upload</span>
      )}
    </label>
  );

  return (
    <section className="workspace-panel" id="compare-workspace">
      <div className="section-heading">
        <p className="section-kicker">COMPARE</p>
        <h2>Document comparison</h2>
      </div>

      <div className="compare-grid">
        {renderFileCard('DOCUMENT A', documentA, onSelectDocumentA)}
        {renderFileCard('DOCUMENT B', documentB, onSelectDocumentB)}
      </div>

      <button
        type="button"
        className="primary-button compare-button"
        onClick={onCompare}
        disabled={!documentA || !documentB || isComparing}
      >
        {isComparing ? 'Comparing documents...' : 'COMPARE DOCUMENTS'}
      </button>

      {result && (
        <div className="comparison-results">
          <h3>Comparison Summary</h3>
          <p className="body-copy">{result.summary}</p>

          <div className="comparison-blocks">
            {result.keyDifferences?.length > 0 && (
              <div className="comparison-block">
                <h4>Key Differences</h4>
                <ul>
                  {result.keyDifferences.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
                </ul>
              </div>
            )}

            {result.addedClauses?.length > 0 && (
              <div className="comparison-block">
                <h4>Added Clauses</h4>
                <ul>
                  {result.addedClauses.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
                </ul>
              </div>
            )}

            {result.removedClauses?.length > 0 && (
              <div className="comparison-block">
                <h4>Removed Clauses</h4>
                <ul>
                  {result.removedClauses.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
                </ul>
              </div>
            )}

            {result.modifiedClauses?.length > 0 && (
              <div className="comparison-block">
                <h4>Modified Clauses</h4>
                <ul>
                  {result.modifiedClauses.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
                </ul>
              </div>
            )}

            {result.obligationChanges?.length > 0 && (
              <div className="comparison-block">
                <h4>Obligation Changes</h4>
                <ul>
                  {result.obligationChanges.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
                </ul>
              </div>
            )}

            {result.deadlineChanges?.length > 0 && (
              <div className="comparison-block">
                <h4>Deadline Changes</h4>
                <ul>
                  {result.deadlineChanges.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
                </ul>
              </div>
            )}

            {result.areasToReview?.length > 0 && (
              <div className="comparison-block">
                <h4>Areas to Review</h4>
                <ul>
                  {result.areasToReview.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
