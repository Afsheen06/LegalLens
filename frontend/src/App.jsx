import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import UploadCard from './components/UploadCard';
import ResultsSection from './components/ResultsSection';
import AskLegalLens from './components/AskLegalLens';
import CompareWorkspace from './components/CompareWorkspace';
import Footer from './components/Footer';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const [compareFiles, setCompareFiles] = useState({ documentA: null, documentB: null });
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState(null);

  const [askDocument, setAskDocument] = useState(null);
  const [askQuestion, setAskQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [askResult, setAskResult] = useState(null);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setAskDocument(file);
    setAnalysisResult(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);

    setTimeout(() => {
      const el = document.getElementById('results-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);

    const formData = new FormData();
    formData.append('document', selectedFile);

    try {
      const response = await fetch('http://localhost:3000/api/analyze', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();

      if (data.success) {
        setAnalysisResult(data);
      } else {
        alert(data.error || 'Failed to analyze document.');
      }
    } catch (error) {
      console.error(error);
      alert('Network error analyzing document.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const validateDocumentFile = (file) => {
    if (!file) return false;
    const valid = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.docx');
    if (!valid) {
      alert('Please select a valid PDF or DOCX file.');
    }
    return valid;
  };

  const handleCompareDocumentSelect = (side, file) => {
    if (!validateDocumentFile(file)) return;
    setCompareFiles((current) => ({ ...current, [side]: file }));
    setComparisonResult(null);
  };

  const handleCompare = async () => {
    if (!compareFiles.documentA || !compareFiles.documentB) return;

    setIsComparing(true);
    setComparisonResult(null);

    const formData = new FormData();
    formData.append('documentA', compareFiles.documentA);
    formData.append('documentB', compareFiles.documentB);

    try {
      const response = await fetch('http://localhost:3000/api/compare', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();

      if (data.success) {
        setComparisonResult(data);
      } else {
        alert(data.error || 'Failed to compare documents.');
      }
    } catch (error) {
      console.error(error);
      alert('Network error during comparison.');
    } finally {
      setIsComparing(false);
    }
  };

  const handleAskDocumentSelect = (file) => {
    if (!validateDocumentFile(file)) return;
    setAskDocument(file);
    setAskResult(null);
  };

  const handleAskLegalLens = async () => {
    if (!askDocument || !askQuestion.trim()) {
      alert('Please select a document and enter a question.');
      return;
    }

    setIsAsking(true);
    setAskResult(null);

    const formData = new FormData();
    formData.append('document', askDocument);
    formData.append('question', askQuestion.trim());

    try {
      const response = await fetch('http://localhost:3000/api/ask', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();

      if (data.success) {
        setAskResult(data);
      } else {
        alert(data.error || 'Failed to ask LegalLens.');
      }
    } catch (error) {
      console.error(error);
      alert('Network error while asking LegalLens.');
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="app-shell">
      <Navbar />

      <main className="app-main">
        <Hero />

        <UploadCard
          selectedFile={selectedFile}
          onFileSelect={handleFileSelect}
          isAnalyzing={isAnalyzing}
          onAnalyze={handleAnalyze}
        />

        <ResultsSection
          isAnalyzing={isAnalyzing}
          selectedFile={selectedFile}
          analysisResult={analysisResult}
        />

        <div className="workspace-grid">
          <AskLegalLens
            selectedDocument={askDocument}
            onDocumentSelect={handleAskDocumentSelect}
            question={askQuestion}
            onQuestionChange={setAskQuestion}
            onAsk={handleAskLegalLens}
            isLoading={isAsking}
            askResult={askResult}
          />

          <CompareWorkspace
            documentA={compareFiles.documentA}
            documentB={compareFiles.documentB}
            onSelectDocumentA={(file) => handleCompareDocumentSelect('documentA', file)}
            onSelectDocumentB={(file) => handleCompareDocumentSelect('documentB', file)}
            onCompare={handleCompare}
            isComparing={isComparing}
            result={comparisonResult}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
