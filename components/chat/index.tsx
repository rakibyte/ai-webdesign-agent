"use client"
import { useChat } from "@ai-sdk/react"
import { generateSlugId } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { DefaultChatTransport, UIMessage } from "ai";
import { toast } from "sonner";
import { PromptInputMessage } from "../ai-elements/prompt-input";
import NewProjectChat from "./new-project-chat";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import ChatPanel from "./chat-panel";
import Canvas from "./canvas";
import { PageType } from "@/types/project";
import { useQuery } from "@tanstack/react-query";
import { useCanvas } from "@/hooks/use-canvas";

type PropsType = {
  isProjectPage?: boolean;
  slugId?: string;
}

const ChatInterface = ({
  isProjectPage = false,
  slugId: propSlugId
}: PropsType) => {
  const pathname = usePathname();
  const router = useRouter()

  const [slugId, setSlugId] = useState(() => propSlugId
    || generateSlugId())


  const [input, setInput] = useState("")
  const [hasStarted, setHasStarted] = useState(isProjectPage);
  const [projectTitle, setProjectTitle] = useState<string | null>(null)
  const [pages, setPages] = useState<PageType[]>([]);

  const { data: projectData, isLoading: isProjectLoading } = useQuery({
    queryKey: ["project", slugId],
    queryFn: async () => {
      const res = await fetch(`/api/project/${slugId}`);
      if (!res.ok) throw new Error("Failed to fetch project");
      return res.json() as Promise<{ title: string; messages: UIMessage[]; pages: PageType[] }>
    },
  enabled: isProjectPage, // Only fetch on project page
  refetchOnWindowFocus: false, // Prevent breaking stream when switching tabs
  staleTime: 1000 * 60 * 5, // 5 minutes cache
  })

  const { messages, sendMessage, setMessages, status, error,
    stop
  } = useChat({
    messages: [],
    transport: new DefaultChatTransport({
      api: "/api/project",
      prepareSendMessagesRequest: ({ messages, body }) => {
        return {
          body: {
            ...body,
            messages
          }
        }
      }
    }),
    onData(dataPart) {
      const part = dataPart as { type: string; data: Record<string, unknown> };
      const data = part.data;

      switch (part.type) {
        case "data-project-title": {
          const projectTitleData = data as { title?: string };
          if (projectTitleData.title) setProjectTitle(projectTitleData.title);
          break;
        }
        case "data-pages-skeleton": {
          const skeletonData = data as { pages?: PageType[] };
          const newPages = (skeletonData.pages || []).map((page) => ({
            id: page.id,
            name: page.name,
            rootStyles: page.rootStyles,
            htmlContent: "",
            isLoading: true,
          }));
          setPages((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            const toAdd = newPages.filter((p) => !existingIds.has(p.id));
            return [...prev, ...toAdd];
          });
          break;
        }

        case "data-page-created": {
          const createdData = data as { page: PageType; tempId?: string };
          const page = createdData.page;
          const tempId = createdData.tempId;
          setPages((prev) => {
            const idx = prev.findIndex(
              (p) => p.id === tempId || p.id === page.id
            );
            if (idx !== -1) {
              const updated = [...prev];
              updated[idx] = {
                ...page,
                isLoading: false,
              };
              return updated;
            }
            return [...prev, { ...page, isLoading: false }];
          });
          break;
        }

        case "data-page-loading": {
          const loadingData = data as { pageId: string };
          const pageId = loadingData.pageId;
          setPages((prev) => {
            const idx = prev.findIndex((p) => p.id === pageId);
            if (idx !== -1) {
              const updated = [...prev];
              updated[idx] = {
                ...updated[idx],
                isLoading: true,
              };
              return updated;
            }
            return prev;
          });
          break;
        }
      }
    },
    onError: (error) => {
      console.log(error);
      toast.error("Failed to generate response");
    },
  });

  // Sync messages when data is initially loaded
  // We use a ref to track the last synced slugId to ensure we only sync once per project,
  const lastSyncedSlug = useRef<string | null>(null);

  useEffect(() => {
    if (projectData && slugId !== lastSyncedSlug.current) {
      lastSyncedSlug.current = slugId;
      if (projectData.messages) setMessages(projectData.messages);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (projectData.pages) setPages(projectData.pages);
    }
  }, [projectData, slugId, setMessages]);

  useEffect(() => {
    const checkReset = () => {
      if (window.location.pathname === "/" && (hasStarted || isProjectPage)) {
        setSlugId(generateSlugId());
        setMessages([]);
        setHasStarted(false);
        setProjectTitle(null);
      }
    };

    window.addEventListener("popstate", checkReset);

    if (pathname === "/" && hasStarted) {
      checkReset();
    }

    return () => window.removeEventListener("popstate", checkReset);
  }, [pathname, hasStarted, isProjectPage, setMessages]);

  const { selectedPageId } = useCanvas();

  const isLoading = status === "submitted" || status === "streaming";

  const onSubmit = async (
    message: PromptInputMessage,
    options: Record<string, unknown> = {}
  ) => {

    if (!message.text.trim()) {
      toast.error("Please enter a message")
      return
    }

    if (!isProjectPage && !hasStarted) {
      window.history.pushState(null, "", `/project/${slugId}`);
      window.dispatchEvent(new Event("pushstate"));
      setHasStarted(true);
    }

    sendMessage(
      {
        text: message.text,
        files: message.files
      },
      {
        body: {
          ...options,
          slugId
        }
      }
    )

    setInput("")
  }

  const handleBack = () => {
    if (!isProjectPage) {
      setSlugId(generateSlugId());
      setHasStarted(false);
      setMessages([]);
      setProjectTitle(null)
    }
    router.push("/");
  }

  if (!isProjectPage && !hasStarted) {
    return (
      <NewProjectChat
        input={input}
        setInput={setInput}
        isLoading={isLoading}
        status={status}
        onStop={stop}
        onSubmit={onSubmit}
      />
    )
  }


  const selectedPage = pages.find((p) => p.id === selectedPageId);


  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="flex flex-col relative w-full max-w-md border-r border-border">
        {/* ProjectTitle Bar */}
        <div className="w-full absolute left-0 top-0 z-10 px-3 py-2 bg-background/95 backdrop-blur-sm border-b">
          <div
            role="button"
            className="flex items-center gap-2 cursor-pointer"
            onClick={handleBack}
          >
            <Button variant="ghost" size="icon" className="size-8">
              <ArrowLeft className="size-4" />
            </Button>
            <h5 className="font-semibold tracking-tight truncate pr-4 text-sm">
              {projectTitle || projectData?.title || "Untitled Project"}
            </h5>
          </div>
        </div>

        <ChatPanel
          className="h-full pt-14"
          messages={messages}
          input={input}
          setInput={setInput}
          isLoading={isLoading}
          isProjectLoading={isProjectLoading}
          selectedPage={selectedPage}
          status={status}
          error={error}
          onStop={stop}
          onSubmit={onSubmit}
        />
      </div>

      <div className="flex-1">
        <Canvas
          pages={pages}
          setPages={setPages}
          slugId={slugId}
          isProjectLoading={isProjectLoading}
        />
      </div>
    </div>
  )
}

export default ChatInterface