import { useState } from 'react';
import AnalysisProgress from './AnalysisProgress';
import DocumentSnapshot from './DocumentSnapshot';
import ClauseMap from './ClauseMap';
import ObligationList from './ObligationList';
import DeadlineTimeline from './DeadlineTimeline';
import ReviewSignals from './ReviewSignals';
import Disclaimer from './Disclaimer';

export default function ResultsSection({ isAnalyzing, selectedFile, analysisResult }) {
  const [activeTab, setActiveTab] = useState('summary');
  const data = analysisResult?.analysis || {};

  if (!selectedFile && !isAnalyzing && !analysisResult) {
    return (
      <section className="results-empty" id="results-section">
        <div className="empty-case-file">
          <p className="section-kicker">CASE FILE EMPTY</p>
          <h2>Upload a PDF or DOCX to begin.</h2>
          <p className="empty-copy">No document context yet.</p>
        </div>
      </section>
    );
  }

  if (isAnalyzing) {
    return <AnalysisProgress selectedFile={selectedFile} />;
  }

  if (!analysisResult) {
    return (
      <section className="results-empty" id="results-section">
        <div className="empty-case-file small">
          <p className="section-kicker">CASE FILE EMPTY</p>
          <h2>Upload a PDF or DOCX to begin.</h2>
          <p className="empty-copy">No document context yet.</p>
        </div>
      </section>
    );
  }

  const tabs = [
    { id: 'summary', label: 'DOCUMENT SNAPSHOT' },
    { id: 'clauses', label: 'CLAUSE MAP' },
    { id: 'obligations', label: 'OBLIGATIONS' },
    { id: 'deadlines', label: 'DEADLINES & TIMING' },
    { id: 'review', label: 'AREAS TO REVIEW' }
  ];

  const renderTab = () => {
    switch (activeTab) {
      case 'summary':
        return <DocumentSnapshot summary={data.summary} />;
      case 'clauses':
        return <ClauseMap clauses={data.importantClauses || []} />;
      case 'obligations':
        return <ObligationList items={data.obligations || []} />;
      case 'deadlines':
        return <DeadlineTimeline items={data.deadlines || []} />;
      case 'review':
        return <ReviewSignals items={data.areasToReview || []} />;
      default:
        return null;
    }
  };

  return (
    <section className="results-shell" id="results-section">
      <div className="results-header">
        <div>
          <p className="section-kicker">CASE FILE</p>
          <h2>Analysis Complete</h2>
        </div>
        <div className="result-meta">
          <span>{analysisResult.filename}</span>
          <span>{analysisResult.fileType?.toUpperCase()}</span>
          <span>{analysisResult.characterCount} characters</span>
        </div>
      </div>

      <div className="case-file-layout">
        <aside className="case-file-nav" aria-label="Analysis sections">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={activeTab === tab.id ? 'nav-tab is-active' : 'nav-tab'}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </aside>

        <div className="case-file-content">
          {renderTab()}
          <Disclaimer />
        </div>
      </div>
    </section>
  );
}
