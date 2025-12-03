import { Link, useLocation } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Home, Users, Calendar, MessageSquare, Bell, Wallet, ShoppingBag, Settings, LogOut } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { CreateClubDialog } from '@/components/clubs/CreateClubDialog';
import { useState } from 'react';

export function MobileNav() {
  const { currentUser, logout, clubs } = useStore();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const navItems = [
    { icon: Home, label: 'Início', path: '/app' },
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
    <div className="md:hidden sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border p-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">Tribo<span className="text-primary">X</span></h1>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="w-6 h-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[85%] p-0">
          <div className="flex flex-col h-full">
            <SheetHeader className="p-6 border-b border-border">
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src={currentUser.avatar} />
                        <AvatarFallback>EU</AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                        <SheetTitle className="text-base">{currentUser.name}</SheetTitle>
                        <p className="text-xs text-muted-foreground">{currentUser.handle}</p>
                    </div>
                </div>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-1 px-4">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                        <Link key={item.path} to={item.path} onClick={() => setOpen(false)}>
                            <Button
                            variant={isActive ? "secondary" : "ghost"}
                            className={cn("w-full justify-start gap-3", isActive && "bg-primary/10 text-primary")}
                            >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                            </Button>
                        </Link>
                        );
                    })}
                </nav>

                <div className="mt-8 px-4">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">
                        Meus Clubes
                    </h3>
                    <div className="space-y-1">
                        {clubs.map((club) => (
                        <Link key={club.id} to={`/app/clubs/${club.id}`} onClick={() => setOpen(false)}>
                            <Button variant="ghost" className="w-full justify-start gap-3 font-normal">
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

            <div className="p-4 border-t border-border space-y-2">
                <CreateClubDialog />
                <Button 
                    variant="ghost" 
                    className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => {
                        logout();
                        setOpen(false);
                    }}
                >
                    <LogOut className="w-5 h-5" />
                    Terminar Sessão
                </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
