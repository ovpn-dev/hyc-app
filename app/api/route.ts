import { Config } from "react-native-config";
import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai"

// export async function POST(request: Request) {
//   const groq = createOpenAI({
//     baseURL: 'https://api.groq.com/openai/v1',
//     apiKey: process.env.OPENAI_API_KEY as string, // Explicitly assert that the API key is a string
//   });

//   const { messages } = await request.json();
//   const result = await streamText({
//     model: groq("llama3-8b-8192"),
//     messages,
//   });
//   return result.toAIStreamResponse();
// }

// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// export async function POST(request: Request) {
//   const messages = await request.json();
//   const result = await streamText({
//     model: groq("llama3-8b-8192"),
//     messages,
//   });
//   return result.toAIStreamResponse();
// }
