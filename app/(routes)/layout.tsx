import Header from "@/components/header";
import { Suspense } from "react";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <Suspense fallback={<div className="h-16 w-full" />}>
        <Header />
      </Suspense>
      <div className="overflow-hidden">{children}</div>
    </main>
  );
}