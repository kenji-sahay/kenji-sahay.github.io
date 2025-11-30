import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { BLOG_POSTS, PORTFOLIO_ITEMS } from "../constants";

// Lazy initialization to prevent crash if API key is missing
let ai: GoogleGenAI | null = null;

function getAI(): GoogleGenAI | null {
  if (!process.env.API_KEY) {
    return null;
  }
  if (!ai) {
    try {
      ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    } catch (e) {
      console.error('Failed to initialize GoogleGenAI:', e);
      return null;
    }
  }
  return ai;
}

const SYSTEM_INSTRUCTION = `
You are the AI assistant for a website called "En Garde Data".
The website belongs to a Data Scientist and Frontend Engineer.
The website features a Technical Blog (LLM, RAG, ML), an Internship Journal, and a Creative Portfolio (Art, Film).

Here is the context of the latest blog posts:
${BLOG_POSTS.map(p => `- Title: ${p.title}\n  - Excerpt: ${p.excerpt}\n  - Tags: ${p.tags.join(', ')}`).join('\n')}

Here is the context of the portfolio items:
${PORTFOLIO_ITEMS.map(p => `- Title: ${p.title}\n  - Type: ${p.type}\n  - Description: ${p.description}`).join('\n')}

Your goal is to answer visitor questions about the content of the website, the author's skills, or summarize the available articles.
Be concise, professional, yet friendly and slightly "cyberpunk" in tone.
If the user asks about something not on the website, politely steer them back to the topics of Data Science, Web Dev, or the Portfolio.
`;

export const streamChatResponse = async function* (userMessage: string) {
  const client = getAI();
  
  if (!client) {
    yield { text: "AI chat is currently unavailable. The API key is not configured." } as GenerateContentResponse;
    return;
  }

  try {
    const responseStream = await client.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    for await (const chunk of responseStream) {
      yield chunk;
    }
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    yield { text: `Error: ${error.message || "Something went wrong connecting to the AI core."}` } as GenerateContentResponse;
  }
};
