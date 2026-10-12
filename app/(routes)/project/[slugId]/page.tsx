import { Suspense, use } from 'react';
import ChatInterface from '@/components/chat';

type PageProps = {
  params: Promise<{ slugId: string }>;
};

function ProjectContent({ params }: { params: Promise<{ slugId: string }> }) {
  const { slugId } = use(params);
  return <ChatInterface isProjectPage={true} slugId={slugId} />;
}

export default function ProjectPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <ProjectContent params={params} />
    </Suspense>
  );
}