import BottomNav from "@/components/shared/bottom-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="w-full max-w-lg relative flex flex-col min-h-screen pb-20">
        {children}
        <BottomNav />
      </div>
    </div>
  );
}
