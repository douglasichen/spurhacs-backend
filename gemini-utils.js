import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Initialize Gemini AI with API key from environment variables
 * Make sure to set GEMINI_API_KEY in your .env file
 */
function initializeGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set. Please add it to your .env file.');
  }
  return new GoogleGenAI({ apiKey });
}

/**
 * Generate content using Gemini AI
 * @param {string} prompt - The prompt to send to Gemini
 * @param {string} model - The model to use (default: "gemini-2.0-flash-exp")
 * @returns {Promise<string>} - The generated response text
 */
export async function generateContent(systemPrompt, userPrompt, model = "gemini-2.5-flash") {
  try {
    const ai = initializeGemini();
    
    const response = await ai.models.generateContent({
      model: model,
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: userPrompt
            }
          ]
        }
      ],
      config: {
        systemInstruction: systemPrompt
      }
    });
    
    return response.text;
  } catch (error) {
    console.error('Error generating content with Gemini:', error);
    throw error;
  }
}

/**
 * Example usage function - demonstrates how to use the Gemini API
 */
export async function exampleUsage() {
  try {
    const response = await generateContent("Explain how AI works in a few words");
    console.log('Gemini Response:', response);
    return response;
  } catch (error) {
    console.error('Example failed:', error.message);
    throw error;
  }
}

/**
 * Main function - runs the example if this file is executed directly
 */
async function main() {
  try {
    console.log('Testing Gemini API...');
    await exampleUsage();
  } catch (error) {
    console.error('Main function failed:', error.message);
    process.exit(1);
  }
}

// Run main function if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}


export async function geminiDiagnosis(bug) {
  const systemPrompt = `
  You are an expert QA engineer for web scrapers.
  You need to diagnose the bug and provide a diagnosis.
  You are given a bug and a set of logs.
  Keep the diagnosises short and concise.
  The diagnosis must not contain the exact logs or diagnosis steps.
  Do not output in JSON, the diagnosis should just be a few sentences at most.
  `;
    delete bug['diagnosis']
    delete bug['diagnosis_steps'][bug['diagnosis_steps'].length - 1]
    console.log(bug)
  const response = await generateContent(systemPrompt, JSON.stringify(bug));
  return response;
}
