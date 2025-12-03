import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Users, Filter, Loader2, Lock, Globe, DollarSign } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export function Explore() {
  const { allClubs, fetchAllClubs, joinClub, currentUser, clubs: myClubs } = useStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAllClubs();
  }, []);

  const handleJoin = async (clubId: string, clubName: string, type: string) => {
    if (type === 'paid') {
        // Redireciona para página do clube para ver planos
        navigate(`/app/clubs/${clubId}`);
        return;
    }

    setLoadingId(clubId);
    const { error } = await joinClub(clubId);
    setLoadingId(null);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao entrar",
        description: "Não foi possível entrar no clube.",
      });
    } else {
      toast({
        title: "Bem-vindo!",
        description: `Você agora faz parte de ${clubName}.`,
      });
      navigate(`/app/clubs/${clubId}`);
    }
  };

  const filteredClubs = allClubs.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          club.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || club.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 pb-20">
      <header>
        <h1 className="text-3xl font-bold mb-2">Explorar Clubes</h1>
        <p className="text-muted-foreground">Descubra novas comunidades e conecte-se com pessoas.</p>
      </header>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-card p-4 rounded-xl border border-border/50">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar clubes..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-48">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <SelectValue placeholder="Categoria" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="Tech">Tecnologia</SelectItem>
            <SelectItem value="Art">Arte & Design</SelectItem>
            <SelectItem value="Business">Negócios</SelectItem>
            <SelectItem value="Health">Saúde</SelectItem>
            <SelectItem value="Gaming">Gaming</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClubs.length === 0 ? (
          <div className="col-span-full text-center py-20 text-muted-foreground">
            Nenhum clube encontrado com esses filtros.
          </div>
        ) : (
          filteredClubs.map((club) => {
            const isMember = myClubs.some(c => c.id === club.id);
            
            return (
              <Card key={club.id} className="flex flex-col overflow-hidden hover:border-primary/50 transition-colors group">
                <div className="h-32 bg-muted relative cursor-pointer" onClick={() => navigate(`/app/clubs/${club.id}`)}>
                  <img src={club.coverImage} alt={club.name} className="w-full h-full object-cover" />
                  {club.isPremium && (
                    <Badge className="absolute top-2 right-2 bg-amber-500">Premium</Badge>
                  )}
                  <div className="absolute bottom-2 right-2">
                      {club.type === 'public' && <Badge variant="secondary" className="gap-1"><Globe className="w-3 h-3" /> Público</Badge>}
                      {club.type === 'private' && <Badge variant="secondary" className="gap-1"><Lock className="w-3 h-3" /> Privado</Badge>}
                      {club.type === 'paid' && <Badge variant="secondary" className="gap-1 bg-green-500/20 text-green-500 hover:bg-green-500/30"><DollarSign className="w-3 h-3" /> Pago</Badge>}
                  </div>
                </div>
                <CardHeader className="relative pt-0 pb-2 cursor-pointer" onClick={() => navigate(`/app/clubs/${club.id}`)}>
                  <div className="flex justify-between items-end -mt-6 mb-2">
                    <Avatar className="w-16 h-16 border-4 border-background">
                      <AvatarImage src={club.image} />
                      <AvatarFallback>{club.name[0]}</AvatarFallback>
                    </Avatar>
                    <Badge variant="outline" className="mb-2">{club.category}</Badge>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">{club.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {club.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" /> {club.membersCount} membros
                    </span>
                    {club.settings.subscriptionPrice > 0 && (
                      <span className="font-semibold text-green-500">
                        {club.settings.subscriptionPrice} {club.settings.currency}/mês
                      </span>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  {isMember ? (
                    <Button variant="secondary" className="w-full" onClick={() => navigate(`/app/clubs/${club.id}`)}>
                      Acessar Clube
                    </Button>
                  ) : (
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90" 
                      onClick={() => handleJoin(club.id, club.name, club.type)}
                      disabled={loadingId === club.id}
                    >
                      {loadingId === club.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                        club.type === 'paid' ? 'Ver Planos' : 
                        club.type === 'private' ? 'Solicitar Acesso' : 'Entrar Agora'
                      }
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
