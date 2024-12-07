import axios from "axios";

const API_KEY = "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";

const openAI = axios.create({
  baseURL: "https://api.groq.com/openai/v1/chat/completions",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
});

export const generateText = async (prompt) => {
  try {
    const response = await openAI.post("/completions", {
      model: "llama3-8b-8192",
      prompt: prompt,
      max_tokens: 150,
    });
    return response.data.choices[0].text;
  } catch (error) {
    console.error("Error generating text:", error);
    throw error;
  }
};
