import { Suspense } from "react";
import ChatInterface from "@/components/chat";

export default function Home() {
  return (
    <div>
      <Suspense fallback={<div className="min-h-screen" />}>
        <ChatInterface isProjectPage={false} />
      </Suspense>
    </div>
  );
}
