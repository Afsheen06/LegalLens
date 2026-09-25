const { GoogleGenAI, Type } = require('@google/genai');

function getAiClient() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not set in environment variables.');
    }

    return new GoogleGenAI({ apiKey });
}

function parseJsonResponse(rawText) {
    const cleaned = String(rawText || '')
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();

    return JSON.parse(cleaned);
}

async function generateJsonResponse(prompt, schema) {
    const ai = getAiClient();

    const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: schema,
        },
    });

    console.log('[geminiAnalyzer] Raw response (first 220 chars):', response.text.substring(0, 220));
    return parseJsonResponse(response.text);
}

async function analyzeDocument(text) {
    const schema = {
        type: Type.OBJECT,
        properties: {
            summary: { type: Type.STRING },
            importantClauses: { type: Type.ARRAY, items: { type: Type.STRING } },
            obligations: { type: Type.ARRAY, items: { type: Type.STRING } },
            deadlines: { type: Type.ARRAY, items: { type: Type.STRING } },
            areasToReview: { type: Type.ARRAY, items: { type: Type.STRING } },
            questionsForLegalProfessional: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedNextSteps: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['summary', 'importantClauses', 'obligations', 'deadlines', 'areasToReview', 'questionsForLegalProfessional', 'suggestedNextSteps']
    };

    const prompt = `You are providing legal-information assistance, NOT legal advice.
Please analyze the following legal document extract in plain language.
Return a JSON object with these fields:
- summary: plain-language overview of the document
- importantClauses: array of strings describing significant clauses or terms
- obligations: array of strings describing responsibilities or duties in the document
- deadlines: array of strings describing date, time period, or deadline information
- areasToReview: array of strings describing items that need attention or clarification
- questionsForLegalProfessional: array of strings phrased as questions to discuss with a legal professional; avoid legal conclusions
- suggestedNextSteps: array of simple next-step suggestions for review

Rules:
- Base all content only on the supplied document text.
- Do not invent information.
- If the document is missing information, say so clearly.
- Keep the tone factual and general.
- The questions should be framed as questions to discuss, not conclusions.
- For example: "Consider asking a legal professional whether this maintenance obligation is appropriate for your situation."

Return ONLY valid JSON with no markdown and no explanation outside the JSON.

Document Text:
${text}
`;

    try {
        return await generateJsonResponse(prompt, schema);
    } catch (error) {
        console.error('[geminiAnalyzer] analyzeDocument error:', error);
        let detail = error.message || String(error);
        try {
            const parsed = JSON.parse(detail);
            detail = parsed?.error?.message || detail;
        } catch (_) { }
        throw new Error(`Gemini API error: ${detail}`);
    }
}

async function compareDocuments(textA, textB) {
    const schema = {
        type: Type.OBJECT,
        properties: {
            summary: { type: Type.STRING },
            keyDifferences: { type: Type.ARRAY, items: { type: Type.STRING } },
            addedClauses: { type: Type.ARRAY, items: { type: Type.STRING } },
            removedClauses: { type: Type.ARRAY, items: { type: Type.STRING } },
            modifiedClauses: { type: Type.ARRAY, items: { type: Type.STRING } },
            obligationChanges: { type: Type.ARRAY, items: { type: Type.STRING } },
            deadlineChanges: { type: Type.ARRAY, items: { type: Type.STRING } },
            areasToReview: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['summary', 'keyDifferences', 'addedClauses', 'removedClauses', 'modifiedClauses', 'obligationChanges', 'deadlineChanges', 'areasToReview']
    };

    const prompt = `Compare the following two legal documents.
Use only information present in the supplied texts.

Do not invent differences. If a point is not found in the document, say so explicitly.
If the documents are substantially different in type or purpose, say so in the summary rather than forcing a misleading comparison.

Return JSON in this exact structure:
- summary: brief comparison summary
- keyDifferences: array of important differences between the documents
- addedClauses: clauses or sections that appear in Document B but not in Document A
- removedClauses: clauses or sections present in Document A but not in Document B
- modifiedClauses: clauses or provisions that appear changed between A and B
- obligationChanges: changes in responsibilities, payment, or duties
- deadlineChanges: changes in timing, notice periods, renewal, or deadlines
- areasToReview: items that may need human/legal review

Keep the wording factual and cautious. Avoid legal conclusions or definitive advice.
Return ONLY valid JSON with no markdown.

Document A:
${textA}

Document B:
${textB}
`;

    try {
        return await generateJsonResponse(prompt, schema);
    } catch (error) {
        console.error('[geminiAnalyzer] compareDocuments error:', error);
        let detail = error.message || String(error);
        try {
            const parsed = JSON.parse(detail);
            detail = parsed?.error?.message || detail;
        } catch (_) { }
        throw new Error(`Gemini API error: ${detail}`);
    }
}

async function askDocumentQuestion(documentText, question) {
    const schema = {
        type: Type.OBJECT,
        properties: {
            answer: { type: Type.STRING },
            relevantSections: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['answer', 'relevantSections']
    };

    const prompt = `Answer the question using only the supplied legal document.
If the document does not contain enough information to answer the question, say that the document does not provide enough information.
Do not invent facts or provide legal advice.
Return only valid JSON.

Question:
${question}

Document Text:
${documentText}
`;

    try {
        return await generateJsonResponse(prompt, schema);
    } catch (error) {
        console.error('[geminiAnalyzer] askDocumentQuestion error:', error);
        let detail = error.message || String(error);
        try {
            const parsed = JSON.parse(detail);
            detail = parsed?.error?.message || detail;
        } catch (_) { }
        throw new Error(`Gemini API error: ${detail}`);
    }
}

module.exports = { analyzeDocument, compareDocuments, askDocumentQuestion };
