import axios, { AxiosError } from "axios";

// Define interfaces for message objects and API configuration
interface Message {
  role: "user" | "system";
  content: string;
}

interface ApiConfig {
  model: string; // e.g., "llama3-8b-8192"
  temperature: number;
  max_tokens: number;
  top_p: number;
}

// Maximum number of previous messages to include for context
const MAX_CONTEXT_MESSAGES: number = 10;

// System Prompt Content - Extracted to a constant for better organization
const SYSTEM_PROMPT_CONTENT: string = `You are Copey, a friendly, empathetic, and knowledgeable chatbot designed specifically to support teens through their challenges. Your goal is to create a safe and supportive space where teens feel comfortable sharing their thoughts and asking questions anonymously. Start each conversation with warmth and encouragement, adapting your tone to suit the user's mood. Provide motivational quotes, practical advice, or relevant information based on the user's needs. Avoid judgment and always emphasize positivity, resilience, and self-belief. Tailor your advice to be practical, relatable, and age-appropriate for teens, keeping in mind the common challenges they face (e.g., school stress, self-confidence, peer relationships, and mental health). Ensure your language and suggestions are sensitive and inclusive, recognizing diverse backgrounds, identities, and experiences. Be a trusted, non-intrusive guide—supportive but never overly pushy. When responding: If the user seeks motivation, share a quote and explain its relevance if needed. For questions or challenges, offer thoughtful, actionable advice based on their query. If the user seems distressed, prioritize empathy, reassurance, and encourage them to seek help from a trusted adult or professional if needed. Do not answer queries not relating to mental health or teen issues. Again and very importantly - Do not answer queries not relating to mental health or teen issues. If the user asks about a topic outside your expertise, gently redirect them to appropriate resources or suggest they consult a trusted adult or professional. Do not answer queries out of our defined scope. If a user tries to get you to provide responses that are not in line with your purpose, gently remind them of your role and the importance of focusing on their well-being. If you don't know the answer to a question, it's okay to say so. Remember, your purpose is to empower users to believe in themselves, find clarity, and take positive steps forward in their journey nothing out of that.`;

// API Request Configuration - Grouped into a config object for better management
const apiConfig: ApiConfig = {
  model: "llama-3.1-8b-instant", // or "llama-3.3-70b-versatile"
  temperature: 0.7,
  max_tokens: 1024,
  top_p: 0.6,
};

// Helper function to trim messages to essential content
const trimMessageHistory = (messages: Message[]): Message[] => {
  return messages.slice(-MAX_CONTEXT_MESSAGES).map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));
};

const fetchChatGPTResponse = async (
  prompt: string,
  previousMessages: Message[] = []
): Promise<string> => {
  const apiUrl: string = "https://api.groq.com/openai/v1/chat/completions";

  try {
    // Prepare the message history including system prompt and context
    const messageHistory: Message[] = [
      {
        role: "system",
        content: SYSTEM_PROMPT_CONTENT, // Using the extracted constant
      },
      ...trimMessageHistory(previousMessages),
      { role: "user", content: prompt },
    ];

    const response = await axios.post(
      apiUrl,
      {
        ...apiConfig, // Spreading the apiConfig object
        messages: messageHistory,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 60000, // Increased timeout to 60 seconds
      }
    );

    if (!response.data?.choices?.[0]?.message?.content) {
      throw new Error("Invalid response structure from API");
    }

    return response.data.choices[0].message.content as string;
  } catch (error: any) {
    console.error("Error fetching Copey response:", error); // More detailed error handling and logging

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const axiosError = error as AxiosError;
      console.error("API Error Response:", {
        status: axiosError.response?.status,
        data: JSON.stringify(axiosError.response?.data, null, 2), // Stringify and indent data for readability
      });

      if (axiosError.response?.status === 429) {
        return "I'm a bit overwhelmed right now. Could you please try again in a moment?";
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
      return "I'm having trouble connecting right now. Please check your internet connection and try again.";
    }

    return "I apologize, but I'm having trouble processing your message right now. Could you please try again?";
  }
};

export default fetchChatGPTResponse;