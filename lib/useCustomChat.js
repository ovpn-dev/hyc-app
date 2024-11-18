import { useState, useCallback } from "react";

export function useCustomChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleInputChange = useCallback((text) => {
    setInput(text);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");

    // Here you would typically make an API call to your AI service
    // For now, we'll just simulate a response
    setTimeout(() => {
      const aiMessage = {
        role: "assistant",
        content: "This is a simulated AI response.",
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    }, 1000);
  }, [input]);

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
  };
}
