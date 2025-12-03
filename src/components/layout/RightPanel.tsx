import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Users } from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

export function RightPanel() {
  const { recommendedClubs, upcomingEvents } = useStore();

  return (
    <aside className="w-80 hidden lg:block h-screen sticky top-0 p-6 overflow-y-auto border-l border-border bg-card/30">
      <div className="space-y-6">
        
        {/* Recommended Clubs */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Clubes Recomendados</h3>
          <div className="space-y-3">
            {recommendedClubs.map((club) => (
              <Card key={club.id} className="bg-card border-border/50 hover:border-primary/50 transition-colors">
                <div className="p-3 flex items-center gap-3">
                  <Avatar className="h-10 w-10 rounded-lg">
                    <AvatarImage src={club.image} className="object-cover" />
                    <AvatarFallback>{club.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{club.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {club.members} membros
                    </p>
                  </div>
                  <Button size="sm" className="bg-primary hover:bg-primary/90 h-8 px-3 rounded-full">
                    Entrar
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Upcoming Events */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Próximos Eventos</h3>
          <div className="space-y-3">
            {upcomingEvents.map((event) => {
                const eventDate = new Date(event.date);
                return (
                <Card key={event.id} className="bg-card border-border/50">
                    <div className="p-3 flex gap-3">
                        <div className="flex flex-col items-center justify-center bg-primary/10 rounded-lg w-12 h-12 shrink-0 text-primary">
                            <span className="text-[10px] font-bold uppercase">{format(eventDate, 'MMM', { locale: pt })}</span>
                            <span className="text-lg font-bold">{format(eventDate, 'dd')}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium leading-tight mb-1">{event.title}</p>
                            <p className="text-xs text-muted-foreground">{event.clubName}</p>
                            <p className="text-xs text-muted-foreground mt-1">{format(eventDate, 'HH:mm')}</p>
                        </div>
                    </div>
                </Card>
            )})}
          </div>
        </section>

        {/* Footer */}
        <div className="text-xs text-muted-foreground pt-4 border-t border-border">
            <p>© 2025 TriboX Club.</p>
            <div className="flex gap-2 mt-2">
                <a href="#" className="hover:text-primary">Privacidade</a>
                <span>•</span>
                <a href="#" className="hover:text-primary">Termos</a>
                <span>•</span>
                <a href="#" className="hover:text-primary">Ajuda</a>
            </div>
        </div>

      </div>
    </aside>
  );
}
