import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { RightPanel } from './RightPanel';
import { MobileNav } from './MobileNav';

export function AppLayout() {
  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans flex-col md:flex-row">
      <MobileNav />
      <Sidebar />
      <main className="flex-1 border-x border-border/50 min-w-0">
        <Outlet />
      </main>
      <RightPanel />
    </div>
  );
}
