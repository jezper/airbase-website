export function PageWrapper({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main className={`w-full max-w-content mx-auto px-6 md:px-12 ${className}`}>
      {children}
    </main>
  );
}
