import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="py-10 px-6"
      style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span
          className="text-lg font-bold text-gradient"
          style={{ fontFamily: "var(--font-display)" }}
        >
          veil
        </span>
        <nav className="flex items-center gap-6 text-sm text-[#444466]">
          <Link href="/login" className="hover:text-[#8888aa] transition-colors">
            Sign in
          </Link>
          <Link href="/signup" className="hover:text-[#8888aa] transition-colors">
            Sign up
          </Link>
          <span>Privacy</span>
          <span>Terms</span>
        </nav>
        <p className="text-xs text-[#444466]">© 2026 Veil. Personality first.</p>
      </div>
    </footer>
  );
}
