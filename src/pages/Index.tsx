
import React from "react";
import ChatInterface from "@/components/ChatInterface";
import Header from "@/components/Header";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 md:py-10 max-w-4xl">
        <ChatInterface />
      </main>
      <footer className="py-4 text-center text-sm text-muted-foreground">
        Password Analyzer Chatbot &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default Index;
