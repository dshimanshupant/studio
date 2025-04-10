"use client";

import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarConversationsComponent,
  SidebarInset,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { format } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<
    { date: string; summary: string; messages: Message[] }[]
  >([]);

  useEffect(() => {
    // Load chat history from local storage on initial render
    const storedHistory = localStorage.getItem("chatHistory");
    if (storedHistory) {
      setChatHistory(JSON.parse(storedHistory));
    }
  }, []);

  const handleSend = async () => {
    if (!prompt.trim()) return;

    const userMessage = { role: "user", content: prompt };
    setMessageHistory((prev) => [...prev, userMessage]);
    setLoading(true);

    // Simulate LLM response (replace with actual API call)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const modelResponse = "This is a simulated response from the LLM model.";

    const modelMessage = { role: "model", content: modelResponse };
    const newHistory = [
      ...messageHistory,
      userMessage,
      modelMessage
    ];
    setMessageHistory(newHistory);

    // Update chat history
    const newChatEntry = {
      date: new Date().toLocaleDateString(),
      summary: prompt.substring(0, 50) + (prompt.length > 50 ? "..." : ""),
      messages: newHistory,
    };

    // Store updated history in local storage
    const updatedChatHistory = [...chatHistory, newChatEntry];
    setChatHistory(updatedChatHistory);
    localStorage.setItem("chatHistory", JSON.stringify(updatedChatHistory));

    setPrompt("");
    setLoading(false);
  };

  const loadConversation = (messages: Message[]) => {
    setMessageHistory(messages);
  };

  const newSession = () => {
    setMessageHistory([]);
    setChatHistory([]);
    localStorage.removeItem("chatHistory");
  };

  return (
    <SidebarProvider defaultOpen={!isMobile} className="h-screen">
      <Sidebar
        className="bg-sidebar border-r"
        style={{ position: "fixed", height: "100vh" }}
      >
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>Chatbot</SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarSeparator />
            <Button
              variant="outline"
              className="w-full justify-start"
              style={{
                backgroundColor: 'rgba(0, 255, 0, 0.1)', // Transparent green
                color: 'white',
                width: '70%',
                marginLeft: '15%',
                borderColor: 'transparent', // Remove border
              }}
              onClick={newSession}
            >
              New Session
            </Button>
          </SidebarMenu>
          <SidebarConversationsComponent
            chatHistory={chatHistory}
            onLoad={loadConversation}
          />
        </SidebarContent>
      </Sidebar>
      <SidebarInset
        className="bg-background flex flex-col h-screen flex-grow"
      >
        <div className="flex-1 flex flex-col p-4">
          {/* Model Selection */}
          <div className="mb-4">
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
          </div>

          {/* Message History Display */}
          <Card className="flex-1 mb-4">
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
                          : "bg-gray-100 dark:bg-gray-700 dark:text-white self-start"
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
      </SidebarInset>
    </SidebarProvider>
  );
}
