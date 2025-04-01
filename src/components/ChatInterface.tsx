
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Send, Trash2 } from "lucide-react";
import ModeToggle from "@/components/ModeToggle";
import ChatMessage from "@/components/ChatMessage";
import { useToast } from "@/components/ui/use-toast";
import { analyzePassword } from "@/utils/passwordAnalyzer";
import { Message, UserMode } from "@/types/chat";

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Welcome to PassGuard! I can help analyze your password strength. Type a password to get started.",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [userMode, setUserMode] = useState<UserMode>("personal");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!inputValue.trim()) return;

    // Add user message
    const userMessageId = Date.now().toString();
    const newUserMessage: Message = {
      id: userMessageId,
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue("");
    setIsAnalyzing(true);

    // Analyze the password and get a response
    try {
      const analysis = await analyzePassword(inputValue, userMode);
      
      // Add bot response
      const botMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: analysis.message,
        analysis: analysis,
        timestamp: new Date(),
      };

      // Add a small delay to make it feel more natural
      setTimeout(() => {
        setMessages((prev) => [...prev, botMessage]);
        setIsAnalyzing(false);
      }, 800);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze password. Please try again.",
        variant: "destructive",
      });
      setIsAnalyzing(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Chat cleared. I can help analyze your password strength. Type a password to get started.",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <Card className="flex flex-col h-[calc(100vh-12rem)] md:h-[calc(100vh-14rem)] shadow-md border p-0 overflow-hidden">
      <div className="p-4 border-b flex items-center justify-between bg-card">
        <h2 className="text-lg font-medium">Password Analyzer</h2>
        <ModeToggle userMode={userMode} setUserMode={setUserMode} />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} userMode={userMode} />
        ))}
        
        {isAnalyzing && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-security-business animate-pulse"></div>
            <p>Analyzing password...</p>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your password to analyze..."
            className="flex-1"
            disabled={isAnalyzing}
            type="password"
          />
          <Button type="submit" size="icon" disabled={isAnalyzing}>
            <Send className="h-4 w-4" />
          </Button>
          <Button 
            type="button" 
            size="icon" 
            variant="outline" 
            onClick={handleClearChat}
            disabled={isAnalyzing || messages.length <= 1}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default ChatInterface;
