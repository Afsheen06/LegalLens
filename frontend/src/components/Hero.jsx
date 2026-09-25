export default function Hero() {
  return (
    <section className="hero-section">
      <p className="eyebrow">AI LEGAL DOCUMENT INTELLIGENCE</p>

      <h1 className="hero-title">
        Understand what your documents <span className="hero-highlight">actually</span> say.
      </h1>

      <p className="hero-copy">
        LegalLens transforms complex legal documents into clear summaries, important clauses,
        obligations, deadlines, and review points.
      </p>

      <div className="hero-features" aria-label="Key features">
        <span>PDF + DOCX</span>
        <span>AI-ASSISTED REVIEW</span>
        <span>DOCUMENT-GROUNDED ANALYSIS</span>
      </div>

      <div className="hero-cta-row">
        <button type="button" className="primary-button">
          Analyze a document <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
}
