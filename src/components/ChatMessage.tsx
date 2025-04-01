
import React from "react";
import { cn } from "@/lib/utils";
import { Message, UserMode } from "@/types/chat";
import PasswordStrengthIndicator from "@/components/PasswordStrengthIndicator";
import { User, Bot } from "lucide-react";

interface ChatMessageProps {
  message: Message;
  userMode: UserMode;
}

const ChatMessage = ({ message, userMode }: ChatMessageProps) => {
  const isUser = message.role === "user";
  
  return (
    <div
      className={cn(
        "flex gap-3 max-w-[85%]",
        isUser ? "ml-auto" : "mr-auto"
      )}
    >
      {!isUser && (
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground flex-shrink-0">
          <Bot className="h-4 w-4" />
        </div>
      )}
      
      <div className="space-y-2">
        <div
          className={cn(
            "rounded-lg p-3",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-muted"
          )}
        >
          {isUser ? (
            <p>●●●●●●●●●●●</p>
          ) : (
            <>
              <p className="whitespace-pre-wrap">{message.content}</p>
              {message.analysis && (
                <div className="mt-3">
                  <PasswordStrengthIndicator analysis={message.analysis} userMode={userMode} />
                </div>
              )}
            </>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      
      {isUser && (
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground flex-shrink-0">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
