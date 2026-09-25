const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

async function extractTextFromFile(buffer, fileType, originalname = '') {
    const isPDF = fileType === 'application/pdf' || originalname.toLowerCase().endsWith('.pdf');
    const isDOCX =
        fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        fileType.includes('wordprocessingml') ||
        fileType.includes('docx') ||
        originalname.toLowerCase().endsWith('.docx');

    console.log(`[documentParser] Extracting: originalname="${originalname}" fileType="${fileType}" isPDF=${isPDF} isDOCX=${isDOCX}`);

    if (isPDF) {
        try {
            const pdfData = await pdfParse(buffer);
            console.log(`[documentParser] PDF extracted OK, ${pdfData.text.length} chars`);
            return pdfData.text;
        } catch (err) {
            console.error('[documentParser] PDF extraction failed:', err);
            throw new Error(`PDF extraction failed: ${err.message}`);
        }
    } else if (isDOCX) {
        try {
            const result = await mammoth.extractRawText({ buffer });
            console.log(`[documentParser] DOCX extracted OK, ${result.value.length} chars`);
            return result.value;
        } catch (err) {
            console.error('[documentParser] DOCX extraction failed:', err);
            throw new Error(`DOCX extraction failed: ${err.message}`);
        }
    } else {
        throw new Error(
            `Unsupported file type. Received MIME="${fileType}", filename="${originalname}". Only PDF and DOCX are supported.`
        );
    }
}

module.exports = { extractTextFromFile };
