// lib/api.js

// export const getDailyQuote = async () => {
//   try {
//     const response = await fetch("https://zenquotes.io/api/today");
//     if (!response.ok) {
//       throw new Error("Failed to fetch daily quote");
//     }
//     const data = await response.json();
//     return {
//       quoteText: data[0].q, // `q` is the quote text
//       author: data[0].a, // `a` is the author
//     };
//   } catch (error) {
//     console.error("Error fetching daily quote:", error);
//     return null;
//   }
// };
