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
export async function generateContent(prompt, model = "gemini-2.0-flash-exp") {
  try {
    const ai = initializeGemini();
    
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
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
