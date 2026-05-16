import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="w-full max-w-lg px-6">
        <header className="h-16 flex items-center">
          <Link
            href="/"
            className="text-xl font-bold text-gradient"
            style={{ fontFamily: "var(--font-display)" }}
          >
            veil
          </Link>
        </header>
      </div>
      <main className="flex-1 flex items-center justify-center px-6 py-12 w-full">
        {children}
      </main>
    </div>
  );
}
