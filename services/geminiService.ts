import { GoogleGenAI, Type } from "@google/genai";
import { UserLevel, DailyLessonData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

interface GeneratedLesson {
    words: string[];
    sentences: {
        english: string;
        arabic: string;
    }[];
}

const lessonSchema = {
    type: Type.OBJECT,
    properties: {
        words: {
            type: Type.ARRAY,
            description: "An array of 5-7 unique English vocabulary words.",
            items: { type: Type.STRING },
        },
        sentences: {
            type: Type.ARRAY,
            description: "An array of exactly 10 unique, meaningful English sentences.",
            items: {
                type: Type.OBJECT,
                properties: {
                    english: {
                        type: Type.STRING,
                        description: "The English sentence.",
                    },
                    arabic: {
                        type: Type.STRING,
                        description: "The Arabic translation of the sentence.",
                    },
                },
                required: ["english", "arabic"],
            },
        },
    },
    required: ["words", "sentences"],
};


export const generateDailyLesson = async (level: UserLevel): Promise<Omit<DailyLessonData, 'date'>> => {
    const prompt = `
        You are an expert English teacher creating a daily lesson for an Arabic-speaking student.
        The student's level is ${level}.
        Your task is to generate a complete lesson in a single JSON object.
        
        The lesson must contain:
        1. A JSON array named "words" with 5-7 unique and useful English vocabulary words suitable for a ${level} learner.
        2. A JSON array named "sentences" with exactly 10 unique, meaningful English sentences.
           - Each sentence must naturally incorporate at least one of the generated words from the "words" list.
           - For each sentence, provide a clear and accurate Arabic translation.
           - The difficulty of the sentences must match the ${level} level.

        Your entire response must be a single, valid JSON object that strictly follows the provided schema.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: lessonSchema,
            }
        });

        const lessonText = response.text.trim();
        const parsedLesson: GeneratedLesson = JSON.parse(lessonText);
        
        if (!parsedLesson.words || !parsedLesson.sentences || parsedLesson.sentences.length !== 10) {
            throw new Error("Invalid lesson format received from API.");
        }

        return {
            words: parsedLesson.words,
            sentences: parsedLesson.sentences
        };
    } catch (error) {
        console.error("Error generating lesson with Gemini:", error);
        throw new Error("Could not generate the daily lesson. The AI service might be unavailable.");
    }
};

export const getPronunciationFeedback = async (correctSentence: string, userAttempt: string): Promise<string> => {
    const prompt = `
        You are an English pronunciation coach for an Arabic speaker.
        The user was supposed to say: "${correctSentence}"
        But they said: "${userAttempt}"
        
        Analyze the difference and provide one short, simple, and encouraging tip in Arabic to help them improve.
        Focus on the most significant error. Start the tip directly without any greetings.
        For example: "نصيحة جيدة! حاول نطق كلمة 'the' بصوت 'ذ' وليس 'ز'."
        If the attempt is very close to correct, just give them encouragement in Arabic.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error getting pronunciation feedback:", error);
        return "حدث خطأ أثناء تحليل النطق. حاول مرة أخرى.";
    }
};