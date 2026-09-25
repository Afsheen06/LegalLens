const fs = require('fs');
const { extractTextFromFile } = require('./utils/documentParser');

(async () => {
    try {
        const fileBuffer = fs.readFileSync('./node_modules/mammoth/test/test-data/single-paragraph.docx');

        // Simulating the wrong mimetype but correct extension fallback
        const extractedText = await extractTextFromFile(fileBuffer, 'application/octet-stream', 'test.docx');

        console.log("Extracted text length:", extractedText.length);
        console.log("Extracted text preview:", extractedText.substring(0, 100));
        console.log("Test Passed!");
    } catch (error) {
        console.error("Test Failed:", error);
    }
})();
