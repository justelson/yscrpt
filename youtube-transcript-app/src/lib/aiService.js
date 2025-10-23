import Groq from 'groq-sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Default API keys (can be overridden by user)
const DEFAULT_GROQ_KEY = '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';
const DEFAULT_GEMINI_KEY = 'AIzaSyAyY0Ebpwr5jXBIoup1cWr1jfvXLXvfmtw';

// Access codes
const ACCESS_CODES = {
    groq: {
        code1: 'elsondev26',
        code2: 'irenendonde',
    },
    gemini: {
        code1: 'elsondev26',
        code2: 'makande25',
    },
};

export function verifyAccessCode(provider, code1, code2) {
    const codes = ACCESS_CODES[provider];
    if (!codes) return false;
    return code1 === codes.code1 && code2 === codes.code2;
}

export async function callGroqAPI(apiKey, messages, model = 'llama-3.3-70b-versatile') {
    try {
        const groq = new Groq({
            apiKey: apiKey || DEFAULT_GROQ_KEY,
            dangerouslyAllowBrowser: true,
        });

        const completion = await groq.chat.completions.create({
            messages,
            model,
            temperature: 0.7,
            max_tokens: 2048,
        });

        return completion.choices[0]?.message?.content || '';
    } catch (error) {
        console.error('Groq API Error:', error);
        throw new Error('Failed to get response from Groq AI');
    }
}

export async function callGeminiAPI(apiKey, prompt, model = 'gemini-pro') {
    try {
        const genAI = new GoogleGenerativeAI(apiKey || DEFAULT_GEMINI_KEY);
        const geminiModel = genAI.getGenerativeModel({ model });

        const result = await geminiModel.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Gemini API Error:', error);
        throw new Error('Failed to get response from Gemini AI');
    }
}

// AI Feature Functions
export async function chatAboutTranscript(provider, apiKey, transcript, userMessage, chatHistory = []) {
    const transcriptText = transcript.map((t) => t.text).join(' ');

    if (provider === 'groq') {
        const messages = [
            {
                role: 'system',
                content: `You are a helpful assistant analyzing a YouTube video transcript. Here is the transcript:\n\n${transcriptText}\n\nAnswer questions about this transcript accurately and helpfully.`,
            },
            ...chatHistory,
            {
                role: 'user',
                content: userMessage,
            },
        ];
        return await callGroqAPI(apiKey, messages);
    } else {
        const prompt = `You are analyzing a YouTube video transcript. Here is the transcript:\n\n${transcriptText}\n\nUser question: ${userMessage}\n\nProvide a helpful and accurate answer based on the transcript.`;
        return await callGeminiAPI(apiKey, prompt);
    }
}

export async function generateQuestions(provider, apiKey, transcript, count = 5) {
    const transcriptText = transcript.map((t) => t.text).join(' ');

    const prompt = `Based on this YouTube video transcript, generate ${count} thoughtful questions that test understanding of the key concepts.

IMPORTANT: Return ONLY a valid JSON array with this exact structure:
[
  {"question": "question text here", "answer": "detailed answer based on the transcript"},
  {"question": "question text here", "answer": "detailed answer based on the transcript"}
]

Do not include any markdown, explanations, or text outside the JSON array. Each question should have a comprehensive answer based on the transcript content.

Transcript:
${transcriptText}`;

    if (provider === 'groq') {
        const response = await callGroqAPI(apiKey, [{ role: 'user', content: prompt }]);
        // Try to extract JSON if wrapped in markdown
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        return jsonMatch ? jsonMatch[0] : response;
    } else {
        const response = await callGeminiAPI(apiKey, prompt);
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        return jsonMatch ? jsonMatch[0] : response;
    }
}

export async function generateFlashcards(provider, apiKey, transcript, count = 10) {
    const transcriptText = transcript.map((t) => t.text).join(' ');

    const prompt = `Based on this YouTube video transcript, create ${count} flashcards for studying. 
    
IMPORTANT: Return ONLY a valid JSON array with this exact structure:
[
  {"question": "question text here", "answer": "answer text here"},
  {"question": "question text here", "answer": "answer text here"}
]

Do not include any markdown, explanations, or text outside the JSON array.

Transcript:
${transcriptText}`;

    if (provider === 'groq') {
        const response = await callGroqAPI(apiKey, [{ role: 'user', content: prompt }]);
        // Try to extract JSON if wrapped in markdown
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        return jsonMatch ? jsonMatch[0] : response;
    } else {
        const response = await callGeminiAPI(apiKey, prompt);
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        return jsonMatch ? jsonMatch[0] : response;
    }
}

export async function summarizeTranscript(provider, apiKey, transcript) {
    const transcriptText = transcript.map((t) => t.text).join(' ');

    const prompt = `Provide a comprehensive summary of this YouTube video transcript, highlighting the main points and key takeaways:\n\n${transcriptText}`;

    if (provider === 'groq') {
        return await callGroqAPI(apiKey, [{ role: 'user', content: prompt }]);
    } else {
        return await callGeminiAPI(apiKey, prompt);
    }
}

export async function generateNewScript(provider, apiKey, transcript, style = 'professional') {
    const transcriptText = transcript.map((t) => t.text).join(' ');

    const prompt = `Rewrite this YouTube video transcript in a ${style} style, maintaining the key information but improving clarity and flow:\n\n${transcriptText}`;

    if (provider === 'groq') {
        return await callGroqAPI(apiKey, [{ role: 'user', content: prompt }]);
    } else {
        return await callGeminiAPI(apiKey, prompt);
    }
}

export async function extractKeyPoints(provider, apiKey, transcript) {
    const transcriptText = transcript.map((t) => t.text).join(' ');

    const prompt = `Extract the key points and main ideas from this YouTube video transcript. Format as bullet points:\n\n${transcriptText}`;

    if (provider === 'groq') {
        return await callGroqAPI(apiKey, [{ role: 'user', content: prompt }]);
    } else {
        return await callGeminiAPI(apiKey, prompt);
    }
}

export async function translateTranscript(provider, apiKey, transcript, targetLanguage) {
    const transcriptText = transcript.map((t) => t.text).join(' ');

    const prompt = `Translate this YouTube video transcript to ${targetLanguage}:\n\n${transcriptText}`;

    if (provider === 'groq') {
        return await callGroqAPI(apiKey, [{ role: 'user', content: prompt }]);
    } else {
        return await callGeminiAPI(apiKey, prompt);
    }
}
