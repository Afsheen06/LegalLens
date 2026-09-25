export default function DocumentSnapshot({ summary }) {
  return (
    <div className="content-panel">
      <div className="panel-header">
        <p className="section-kicker">DOCUMENT SNAPSHOT</p>
      </div>
      <p className="body-copy">{summary || 'No summary available for this document.'}</p>
    </div>
  );
}
