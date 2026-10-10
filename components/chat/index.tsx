"use client";

import { DefaultChatTransport } from "ai";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { toast } from "sonner";
import { generateSlugId } from "@/lib/utils";
import { PromptInputMessage } from "../ai-elements/prompt-input";
import NewProjectChat, { NewChat } from "./new-project-chat";

type PropsType = {
  isProjectPage?: boolean;
  slugId?: string;
};

const ChatInterface = ({
  isProjectPage = false,
  slugId: propSlugId,
}: PropsType) => {
  const pathname = usePathname();
  const router = useRouter();
  const [slugId, setSlugId] = useState(propSlugId || "");
  const [input, setInput] = useState("");
  const [hasStarted, setHasStarted] = useState(isProjectPage);
  const [projectTitle, setProjectTitle] = useState<string | null>(null);

  useEffect(() => {
    if (!slugId && typeof window !== "undefined") {
      setSlugId(generateSlugId());
    }
  }, [slugId]);

  const { messages, sendMessage, setMessages, status, error, stop } = useChat({
    messages: [],
    transport: new DefaultChatTransport({
      api: "/api/project",
      prepareSendMessagesRequest: ({ messages, body }) => {
        return {
          body: {
            ...body,
            messages,
          },
        };
      },
    }),
    onError: (err) => {
      console.error(err);
      toast.error("Failed to generate response");
    },
  });

  useEffect(() => {
    const checkReset = () => {
      if (window.location.pathname === "/" && (hasStarted || isProjectPage)) {
        setSlugId(generateSlugId());
        setHasStarted(false);
        setMessages([]);
        setInput("");
        setProjectTitle(null);
      }
    };

    window.addEventListener("popstate", checkReset);
    if (pathname === "/" && hasStarted) {
      checkReset();
    }

    return () => window.removeEventListener("popstate", checkReset);
  }, [pathname, hasStarted, isProjectPage, setMessages]);

  const isLoading = status === "submitted" || status === "streaming";

  const onSubmit = async (message: PromptInputMessage, options: any = {}) => {
    if (!message.text.trim()) {
      toast.error("Please enter a message");
      return;
    }
    const currentSlugId = slugId || generateSlugId();
    if (!slugId) {
      setSlugId(currentSlugId);
    }
    if (!isProjectPage && !hasStarted) {
      window.history.pushState(null, "", `/project/${currentSlugId}`);
      setHasStarted(true);
    }
    await sendMessage(
      {
        text: message.text,
        files: message.files,
      },
      {
        body: {
          ...options,
          slugId: currentSlugId,
          projectName: projectTitle,
        },
      }
    );
    setInput("");
  };

  if (!isProjectPage && !hasStarted) {
    return (
      <NewChat
        input={input}
        setInput={setInput}
        isLoading={isLoading}
        status={status}
        onStop={stop}
        onSubmit={onSubmit}
      />
    );
  }

  return (
    <div className="w-full">
      <div>ChatInterface</div>
    </div>
  );
};

export default ChatInterface;
