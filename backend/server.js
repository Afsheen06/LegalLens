require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { extractTextFromFile } = require('./utils/documentParser');
const { analyzeDocument, compareDocuments, askDocumentQuestion } = require('./utils/geminiAnalyzer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const upload = multer({
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const isPDF = file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf');
        const isDOCX = file.mimetype.includes('docx') || file.mimetype.includes('wordprocessingml') || file.originalname.toLowerCase().endsWith('.docx');

        if (isPDF || isDOCX) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF and DOCX files are allowed.'));
        }
    }
});

function getFileType(file) {
    return (file.mimetype.includes('pdf') || file.originalname.toLowerCase().endsWith('.pdf')) ? 'pdf' : 'docx';
}

app.post('/api/analyze', upload.single('document'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No file uploaded.' });
        }

        const { originalname, mimetype, buffer } = req.file;
        const extractedText = await extractTextFromFile(buffer, mimetype, originalname);
        const analysis = await analyzeDocument(extractedText);

        res.json({
            success: true,
            filename: originalname,
            fileType: getFileType(req.file),
            characterCount: extractedText.length,
            analysis: analysis
        });
    } catch (error) {
        console.error('[/api/analyze] Error:', error);
        res.status(500).json({ success: false, error: error.message || 'Internal server error' });
    }
});

app.post('/api/compare', upload.fields([
    { name: 'documentA', maxCount: 1 },
    { name: 'documentB', maxCount: 1 }
]), async (req, res) => {
    try {
        const fileA = req.files?.documentA?.[0];
        const fileB = req.files?.documentB?.[0];

        if (!fileA || !fileB) {
            return res.status(400).json({ success: false, error: 'Both documents are required for comparison.' });
        }

        const textA = await extractTextFromFile(fileA.buffer, fileA.mimetype, fileA.originalname);
        const textB = await extractTextFromFile(fileB.buffer, fileB.mimetype, fileB.originalname);
        const comparison = await compareDocuments(textA, textB);

        res.json({
            success: true,
            filenameA: fileA.originalname,
            filenameB: fileB.originalname,
            fileTypeA: getFileType(fileA),
            fileTypeB: getFileType(fileB),
            ...comparison
        });
    } catch (error) {
        console.error('[/api/compare] Error:', error);
        res.status(500).json({ success: false, error: error.message || 'Comparison failed.' });
    }
});

app.post('/api/ask', upload.single('document'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No document uploaded.' });
        }

        const question = String(req.body.question || '').trim();
        if (!question) {
            return res.status(400).json({ success: false, error: 'Question is required.' });
        }

        const extractedText = await extractTextFromFile(req.file.buffer, req.file.mimetype, req.file.originalname);
        const answer = await askDocumentQuestion(extractedText, question);

        res.json({
            success: true,
            answer: answer.answer,
            relevantSections: answer.relevantSections || []
        });
    } catch (error) {
        console.error('[/api/ask] Error:', error);
        res.status(500).json({ success: false, error: error.message || 'Question failed.' });
    }
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'LegalLens backend is running'
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, error: err.message || 'Something went wrong on the server.' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
