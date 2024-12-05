import axios from 'axios';



export const getGeminiResponse = async (inputText: string): Promise<string> => {
  try {
    const response = await axios.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent', {
      prompt: inputText,
      max_tokens: 300,
    }, {
      headers: {
        'Authorization': `Bearer AIzaSyCw8jvqpnJrPgww_lN4j6f39Kd0ptL_6y4`, 
        'Content-Type': 'application/json',
      },
    });

    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error('Error fetching response from Gemini:', error);
    return 'Unable to generate a response at this time. Please try again later.';
  }
};
