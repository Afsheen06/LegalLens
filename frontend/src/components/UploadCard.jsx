export default function UploadCard({ selectedFile, onFileSelect, isAnalyzing, onAnalyze }) {
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    validateFile(file);
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    validateFile(file);
  };

  const validateFile = (file) => {
    if (file && (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.docx'))) {
      onFileSelect(file);
    } else {
      alert('Please select a valid PDF or DOCX file.');
    }
  };

  const formatFileSize = (file) => {
    if (!file) return '';
    const size = file.size;
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <section className="upload-panel">
      <div className="section-heading compact">
        <p className="section-kicker">CASE FILE INTAKE</p>
        <h2>Upload your legal document to begin structured analysis.</h2>
      </div>

      <label
        className={`upload-dropzone ${selectedFile ? 'is-selected' : ''}`}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
      >
        <input type="file" accept=".pdf,.docx" onChange={handleChange} />

        <div className="upload-drop-inner">
          {!selectedFile ? (
            <>
              <div className="upload-callout">Drop PDF or DOCX here</div>
              <div className="upload-secondary">or choose a document</div>
              <div className="upload-hint">PDF / DOCX · Maximum 5 MB</div>
            </>
          ) : (
            <div className="upload-selected-wrap">
              <div className="upload-status">DOCUMENT READY</div>
              <div className="upload-file-name">{selectedFile.name}</div>
              <div className="upload-file-meta">
                <span>{selectedFile.name.toLowerCase().endsWith('.pdf') ? 'PDF' : 'DOCX'}</span>
                <span>{formatFileSize(selectedFile)}</span>
              </div>
            </div>
          )}
        </div>
      </label>

      <div className="upload-actions">
        <button
          type="button"
          className="primary-button full"
          onClick={onAnalyze}
          disabled={!selectedFile || isAnalyzing}
        >
          {isAnalyzing ? 'Analyzing document...' : 'BEGIN ANALYSIS →'}
        </button>
      </div>
    </section>
  );
}
