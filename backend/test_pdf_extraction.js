/**
 * Quick local test: verify PDF and DOCX extraction both work.
 * Run with: node test_pdf_extraction.js
 */
const { extractTextFromFile } = require('./utils/documentParser');
const fs = require('fs');
const path = require('path');

// ---------- helpers ----------
const pdfSample = path.join(__dirname, 'node_modules', 'pdf-parse', 'test', 'data', '05-versions-space.pdf');
const docxSample = path.join(__dirname, 'node_modules', 'mammoth', 'test', 'test-data', 'single-paragraph.docx');

async function run() {
    let pass = 0, fail = 0;

    // ---- PDF via MIME type ----
    try {
        const buf = fs.readFileSync(pdfSample);
        const text = await extractTextFromFile(buf, 'application/pdf', 'test.pdf');
        console.log(`[PASS] PDF (MIME): ${text.length} chars extracted`);
        pass++;
    } catch (e) {
        console.error('[FAIL] PDF (MIME):', e.message);
        fail++;
    }

    // ---- PDF via extension fallback ----
    try {
        const buf = fs.readFileSync(pdfSample);
        const text = await extractTextFromFile(buf, 'application/octet-stream', 'test.pdf');
        console.log(`[PASS] PDF (ext fallback): ${text.length} chars extracted`);
        pass++;
    } catch (e) {
        console.error('[FAIL] PDF (ext fallback):', e.message);
        fail++;
    }

    // ---- DOCX via MIME type ----
    try {
        const buf = fs.readFileSync(docxSample);
        const text = await extractTextFromFile(buf, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'test.docx');
        console.log(`[PASS] DOCX (MIME): ${text.length} chars extracted`);
        pass++;
    } catch (e) {
        console.error('[FAIL] DOCX (MIME):', e.message);
        fail++;
    }

    // ---- DOCX via extension fallback ----
    try {
        const buf = fs.readFileSync(docxSample);
        const text = await extractTextFromFile(buf, 'application/octet-stream', 'test.docx');
        console.log(`[PASS] DOCX (ext fallback): ${text.length} chars extracted`);
        pass++;
    } catch (e) {
        console.error('[FAIL] DOCX (ext fallback):', e.message);
        fail++;
    }

    console.log(`\nResults: ${pass} passed, ${fail} failed`);
    if (fail > 0) process.exit(1);
}

run();
