import {model} from '../app';


export const getGeminiResponse = async (inputText: string) => {
  try {

    const prompt = inputText;

    const result = await model.generateContent(prompt);

    const responseResult = await result.response.text();

    return responseResult as string;

  } catch (error) {
    console.error('Error fetching response from Gemini:', error);
    return 'Unable to generate a response at this time. Please try again later.';
  }
};
