import { generateContent } from './gemini-utils.js';

async function main() {
  try {
    // Example 1: Basic usage
    console.log('Example 1: Basic AI explanation');
    const response1 = await generateContent("Explain how AI works in a few words");
    console.log('Response:', response1);
    console.log('---');

    // Example 2: Code explanation
    console.log('Example 2: Code explanation');
    const response2 = await generateContent("Explain what this JavaScript code does: const arr = [1,2,3].map(x => x * 2)");
    console.log('Response:', response2);
    console.log('---');

    // Example 3: Using a different model
    console.log('Example 3: Using gemini-2.0-flash-exp model');
    const response3 = await generateContent("Write a haiku about programming", "gemini-2.0-flash-exp");
    console.log('Response:', response3);

  } catch (error) {
    console.error('Error:', error.message);
    
    if (error.message.includes('GEMINI_API_KEY')) {
      console.log('\nTo fix this:');
      console.log('1. Copy .env.example to .env');
      console.log('2. Add your Gemini API key to the .env file');
      console.log('3. Get your API key from: https://makersuite.google.com/app/apikey');
    }
  }
}

main();
