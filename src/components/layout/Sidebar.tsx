import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Calendar, MessageSquare, Bell, Wallet, ShoppingBag, Settings, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CreateClubDialog } from '@/components/clubs/CreateClubDialog';
import { useEffect } from 'react';

export function Sidebar() {
  const location = useLocation();
  const { currentUser, clubs, logout, fetchMyClubs } = useStore();

  useEffect(() => {
    if (currentUser) {
      fetchMyClubs();
    }
  }, [currentUser]);

  const navItems = [
    { icon: Home, label: 'Início', path: '/app' },
    { icon: Compass, label: 'Explorar', path: '/app/explore' },
    { icon: Users, label: 'Meus Clubes', path: '/app/clubs' },
    { icon: Calendar, label: 'Eventos', path: '/app/events' },
    { icon: MessageSquare, label: 'Mensagens', path: '/app/messages' },
    { icon: Bell, label: 'Notificações', path: '/app/notifications' },
    { icon: Wallet, label: 'Carteira', path: '/app/wallet' },
    { icon: ShoppingBag, label: 'Marketplace', path: '/app/marketplace' },
    { icon: Settings, label: 'Definições', path: '/app/settings' },
  ];

  if (!currentUser) return null;

  return (
    <aside className="w-64 hidden md:flex flex-col h-screen border-r border-border bg-card/50 sticky top-0">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8 cursor-pointer" onClick={() => window.location.href = '/'}>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Tribo<span className="text-primary">X</span></h1>
        </div>

        <div className="flex items-center gap-3 mb-8 p-3 rounded-xl bg-secondary/50">
          <Avatar>
            <AvatarImage src={currentUser.avatar} />
            <AvatarFallback>JS</AvatarFallback>
          </Avatar>
          <div className="overflow-hidden flex-1">
            <p className="text-sm font-medium truncate">{currentUser.name}</p>
            <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <p className="text-xs text-muted-foreground">Online</p>
            </div>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn("w-full justify-start gap-3", isActive && "bg-primary/10 text-primary hover:bg-primary/20")}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="mt-8">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-4">
            Meus Clubes
          </h3>
          <div className="space-y-1">
            {clubs.map((club) => (
              <Link key={club.id} to={`/app/clubs/${club.id}`}>
                <Button variant="ghost" className={cn(
                    "w-full justify-start gap-3 font-normal",
                    location.pathname === `/app/clubs/${club.id}` && "bg-secondary"
                )}>
                    <Avatar className="w-6 h-6">
                        <AvatarImage src={club.image} />
                        <AvatarFallback>{club.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="truncate">{club.name}</span>
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto p-6 space-y-2">
        <CreateClubDialog />
        <Button variant="ghost" className="w-full text-muted-foreground hover:text-destructive" onClick={logout}>
            Sair
        </Button>
      </div>
    </aside>
  );
}
