const fs = require('fs');
const FormData = require('form-data');

(async () => {
    try {
        const fetch = (await import('node-fetch')).default;

        const form = new FormData();
        const fileBuffer = fs.readFileSync('./node_modules/mammoth/test/test-data/single-paragraph.docx');

        form.append('document', fileBuffer, {
            filename: 'test.docx',
            contentType: 'application/octet-stream'
        });

        const response = await fetch('http://localhost:3000/api/analyze', {
            method: 'POST',
            body: form
        });

        const data = await response.json();
        fs.writeFileSync('output.json', JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error("Error during test:", error);
    }
})();
