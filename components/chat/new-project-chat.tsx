"use client";

import React from "react";
import type { ChatStatus } from "ai";
import { Sparkles } from "lucide-react";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputTextarea,
  PromptInputTools,
  PromptInputSubmit,
  PromptInputActionMenu,
  PromptInputActionMenuTrigger,
  PromptInputActionMenuContent,
  PromptInputActionAddAttachments,
  PromptInputActionAddScreenshot,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { Suggestions, Suggestion } from "@/components/ai-elements/suggestion";

export interface NewProjectChatProps {
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  status: ChatStatus;
  onStop: () => void;
  onSubmit: (message: PromptInputMessage, options?: any) => Promise<void> | void;
}

const sampleSuggestions = [
  "Build a SaaS landing page for an AI productivity app with modern Bento grid",
  "Design a dark-themed portfolio website with subtle animations and case studies",
  "Create an e-commerce storefront with product cards, cart preview, and clean filters",
  "Build a modern developer documentation site with syntax highlighting and sidebar",
];

export const NewProjectChat: React.FC<NewProjectChatProps> = ({
  input,
  setInput,
  status,
  onStop,
  onSubmit,
}) => {
  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl space-y-8 text-center">
        {/* Hero header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary shadow-xs">
            <Sparkles className="size-3.5" />
            <span>AI-Powered Web Design & Generation</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            What do you want to{" "}
            <span className="bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              create
            </span>{" "}
            today?
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Turn your ideas into clean, fully-functional websites and UI components instantly.
          </p>
        </div>

        {/* Prompt Input Container */}
        <div className="rounded-2xl border border-border/80 bg-card p-2 shadow-xl shadow-black/5 dark:shadow-none">
          <PromptInput
            onSubmit={onSubmit}
            className="rounded-xl border-none shadow-none"
          >
            <PromptInputBody>
              <PromptInputTextarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your website or paste a reference..."
                className="min-h-24 resize-none border-none bg-transparent px-3 py-2 text-sm shadow-none focus-visible:ring-0 sm:text-base"
              />
            </PromptInputBody>
            <PromptInputFooter className="flex items-center justify-between border-t border-border/40 px-2 pt-2">
              <PromptInputTools>
                <PromptInputActionMenu>
                  <PromptInputActionMenuTrigger />
                  <PromptInputActionMenuContent>
                    <PromptInputActionAddAttachments />
                    <PromptInputActionAddScreenshot />
                  </PromptInputActionMenuContent>
                </PromptInputActionMenu>
              </PromptInputTools>
              <PromptInputSubmit status={status} onStop={onStop} />
            </PromptInputFooter>
          </PromptInput>
        </div>

        {/* Suggestions */}
        <div className="space-y-2 text-left">
          <p className="text-xs font-medium text-muted-foreground">Try asking:</p>
          <Suggestions className="flex-wrap justify-center gap-2">
            {sampleSuggestions.map((suggestion) => (
              <Suggestion
                key={suggestion}
                suggestion={suggestion}
                onClick={handleSuggestionClick}
                className="max-w-md truncate text-xs"
              >
                {suggestion}
              </Suggestion>
            ))}
          </Suggestions>
        </div>
      </div>
    </div>
  );
};

export const NewChat = NewProjectChat;
export default NewProjectChat;