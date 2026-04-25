import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import DemoBanner from '@/components/DemoBanner';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="flex-1 ml-56 min-h-screen flex flex-col">
        <TopBar />
        <DemoBanner />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
