export default function AskLegalLens({
  selectedDocument,
  onDocumentSelect,
  question,
  onQuestionChange,
  onAsk,
  isLoading,
  askResult
}) {
  const suggestions = [
    'What are the main obligations?',
    'What is the termination notice period?',
    'Which information is still missing?',
    'What should I clarify before using this agreement?'
  ];

  const handleSuggestionClick = (value) => {
    onQuestionChange(value);
  };

  return (
    <section className="workspace-panel" id="ask-legallens">
      <div className="section-heading">
        <p className="section-kicker">ASK LEGALLENS</p>
        <h2>Document-grounded questions</h2>
      </div>

      <label className="ask-upload-box">
        <span className="compare-label">DOCUMENT</span>
        <input type="file" accept=".pdf,.docx" onChange={(event) => onDocumentSelect(event.target.files[0])} />
        {selectedDocument ? (
          <div className="compare-file-info">
            <span className="compare-file-name">{selectedDocument.name}</span>
            <span className="compare-file-meta">
              {selectedDocument.name.toLowerCase().endsWith('.pdf') ? 'PDF' : 'DOCX'}
            </span>
          </div>
        ) : (
          <span className="upload-mini">Select a document</span>
        )}
      </label>

      <div className="ask-suggestions" aria-label="Suggested questions">
        {suggestions.map((prompt) => (
          <button
            key={prompt}
            type="button"
            className="text-chip"
            onClick={() => handleSuggestionClick(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="ask-box" aria-label="Question input">
        <textarea
          value={question}
          onChange={(event) => onQuestionChange(event.target.value)}
          placeholder="Ask about the document"
          rows={5}
        />
      </div>

      <button
        type="button"
        className="primary-button compare-button"
        onClick={onAsk}
        disabled={!selectedDocument || !question.trim() || isLoading}
      >
        {isLoading ? 'Asking LegalLens...' : 'ASK LEGALLENS'}
      </button>

      {askResult && (
        <div className="ask-answer-box">
          <h3>Answer</h3>
          <p className="body-copy">{askResult.answer}</p>

          {askResult.relevantSections?.length > 0 && (
            <div className="comparison-block">
              <h4>Relevant Sections</h4>
              <ul>
                {askResult.relevantSections.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
              </ul>
            </div>
          )}

          <p className="doc-disclaimer">Based on the uploaded document. This is general information, not legal advice.</p>
        </div>
      )}
    </section>
  );
}
