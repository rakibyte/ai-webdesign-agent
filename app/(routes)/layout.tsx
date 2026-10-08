export default function HomeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main>
        <div>{children}</div>
    </main>
  );
}
