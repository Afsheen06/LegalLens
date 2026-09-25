require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const { extractTextFromFile } = require('./utils/documentParser');
const { analyzeDocument, compareDocuments, askDocumentQuestion } = require('./utils/geminiAnalyzer');

const PORT = process.env.PORT || 3000;

function createApp() {
    const app = express();

    const allowedOrigins = [
        process.env.FRONTEND_URL,
        'http://localhost:5173',
        'http://127.0.0.1:5173'
    ].filter(Boolean);

    const corsOptions = {
        origin(origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
                return;
            }

            callback(new Error('Not allowed by CORS'));
        },
        credentials: true,
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    };

    const apiLimiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 30,
        standardHeaders: true,
        legacyHeaders: false,
        message: {
            success: false,
            error: 'Too many requests. Please try again later.'
        }
    });

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

    app.use(helmet());
    app.use(cors(corsOptions));
    app.use(express.json({ limit: '1mb' }));
    app.use('/api', apiLimiter);

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
            console.error('[/api/analyze] Error:', error.message);
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
            console.error('[/api/compare] Error:', error.message);
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
            console.error('[/api/ask] Error:', error.message);
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
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ success: false, error: 'File too large. Maximum size is 5MB.' });
            }

            if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                return res.status(400).json({ success: false, error: 'Unexpected file field.' });
            }

            return res.status(400).json({ success: false, error: err.message || 'Upload failed.' });
        }

        if (err && err.message === 'Not allowed by CORS') {
            return res.status(403).json({ success: false, error: 'Origin not allowed.' });
        }

        if (err && /Invalid file type|Only PDF and DOCX files are allowed/i.test(String(err.message || ''))) {
            return res.status(400).json({ success: false, error: err.message || 'Invalid file type. Only PDF and DOCX files are allowed.' });
        }

        console.error('[server] Unhandled error:', err.stack || err.message);

        const status = err && (err.statusCode || err.status) ? err.statusCode || err.status : 500;
        const message = status >= 500 ? 'Something went wrong on the server.' : (err && err.message) || 'Request failed.';

        return res.status(status).json({ success: false, error: message });
    });

    return app;
}

const app = createApp();

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = { app, createApp };
