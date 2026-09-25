export default function Navbar() {
  return (
    <nav className="topbar">
      <div className="brand" aria-label="LegalLens home">
        LegalLens<span className="brand-mark">.</span>
      </div>

      <div className="nav-links" aria-label="Main navigation">
        <a href="#results-section" className="nav-link is-active">ANALYZE</a>
        <a href="#compare-workspace" className="nav-link">COMPARE</a>
        <a href="#ask-legallens" className="nav-link">ASK LEGALLENS</a>
      </div>

      <div className="nav-status" aria-label="Status indicator">
        <span className="nav-status-dot" />
      </div>
    </nav>
  );
}
