"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

const llmModels = [
  { value: "gpt-3.5-turbo", label: "GPT 3.5 Turbo" },
  { value: "gpt-4", label: "GPT 4" },
];

interface Message {
  role: "user" | "model";
  content: string;
}

export default function Home() {
  const [model, setModel] = useState(llmModels[0].value);
  const [messageHistory, setMessageHistory] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!prompt.trim()) return;

    setMessageHistory((prev) => [...prev, { role: "user", content: prompt }]);
    setLoading(true);

    // Simulate LLM response (replace with actual API call)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const modelResponse = "This is a simulated response from the LLM model.";

    setMessageHistory((prev) => [
      ...prev,
      { role: "model", content: modelResponse },
    ]);
    setPrompt("");
    setLoading(false);
  };

  return (
    <div className="container mx-auto max-w-3xl p-4 space-y-4">
      {/* Model Selection */}
      <Select value={model} onValueChange={setModel}>
        <SelectTrigger>
          <SelectValue placeholder="Select LLM Model" />
        </SelectTrigger>
        <SelectContent>
          {llmModels.map((m) => (
            <SelectItem key={m.value} value={m.value}>
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Message History Display */}
      <Card className="h-[400px]">
        <CardContent className="p-2">
          <ScrollArea className="h-full">
            <div className="flex flex-col space-y-2">
              {messageHistory.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "px-4 py-2 rounded-lg",
                    message.role === "user"
                      ? "bg-primary text-white self-end"
                      : "bg-gray-100 text-gray-800 self-start"
                  )}
                >
                  {message.content}
                </div>
              ))}
              {loading && <div>Loading...</div>}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Text Input Field */}
      <div className="flex space-x-2">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
          className="flex-1"
        />
        <Button onClick={handleSend} disabled={loading}>
          <Send className="w-4 h-4 mr-2" />
          Send
        </Button>
      </div>
    </div>
  );
}
