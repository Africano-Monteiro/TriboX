import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useStore, ClubMember } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Shield, Lock, DollarSign, MoreVertical, Eye, Copy, Check, Link as LinkIcon, Users, MessageSquare, FileText, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CreatePost } from '@/components/feed/CreatePost';
import { formatDistanceToNow } from 'date-fns';
import { pt } from 'date-fns/locale';

export function ClubDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getClubById, currentUser, updateClubSettings, updateMemberRole, fetchPosts, posts, joinClub, generateInviteLink } = useStore();
  const { toast } = useToast();
  
  const club = getClubById(id || '');
  const [price, setPrice] = useState(0);
  const [viewAsVisitor, setViewAsVisitor] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    if (club) {
      setPrice(club.settings.subscriptionPrice);
      fetchPosts(club.id);
    }
  }, [club, id]);
  
  if (!club) {
    return <div className="p-8 text-center">Clube não encontrado. <Button variant="link" onClick={() => navigate('/app/explore')}>Voltar para Explorar</Button></div>;
  }

  const myMembership = club.members.find(m => m.userId === currentUser?.id);
  const isMember = !!myMembership;
  const isOwner = myMembership?.role === 'owner';
  const isAdmin = (isOwner || myMembership?.role === 'admin') && !viewAsVisitor;

  // Se não for membro, força a visão de visitante
  const isVisitorView = !isMember || viewAsVisitor;

  const handleSaveSettings = () => {
    updateClubSettings(club.id, { subscriptionPrice: Number(price) });
    toast({ title: "Configurações salvas", description: "As alterações foram aplicadas com sucesso." });
  };

  const handleRoleChange = (userId: string, newRole: ClubMember['role']) => {
    updateMemberRole(club.id, userId, newRole);
    toast({ title: "Cargo atualizado", description: "As permissões do membro foram alteradas." });
  };

  const handleGenerateInvite = () => {
    const link = generateInviteLink(club.id);
    setInviteLink(link);
  };

  const copyInvite = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copiado!", description: "Link de convite copiado para a área de transferência." });
  };

  const handleJoin = async () => {
    setIsJoining(true);
    const { error } = await joinClub(club.id);
    setIsJoining(false);
    
    if (error) {
        toast({ variant: "destructive", title: "Erro", description: "Não foi possível entrar." });
    } else {
        toast({ title: "Sucesso!", description: `Bem-vindo ao ${club.name}` });
    }
  };

  return (
    <div className="pb-20">
      {/* Admin Top Bar - Só aparece para admins reais */}
      {!viewAsVisitor && (isOwner || myMembership?.role === 'admin') && (
        <div className="bg-secondary/30 border-b border-border p-2 px-6 flex justify-between items-center sticky top-0 z-20 backdrop-blur-md">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-3 h-3" /> Painel Administrativo
          </span>
          <div className="flex items-center gap-2">
            <Label htmlFor="view-mode" className="text-xs cursor-pointer flex items-center gap-1">
                <Eye className="w-3 h-3" /> Ver como Visitante
            </Label>
            <Switch 
              id="view-mode" 
              checked={viewAsVisitor} 
              onCheckedChange={setViewAsVisitor}
              className="scale-75"
            />
          </div>
        </div>
      )}

      {/* Club Header */}
      <div className="h-48 md:h-64 w-full relative bg-muted group">
        <img src={club.coverImage} alt="Cover" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      <div className="px-6 -mt-20 relative z-10 flex flex-col md:flex-row items-end md:items-center gap-6 mb-8">
        <Avatar className="w-28 h-28 md:w-36 md:h-36 border-4 border-background shadow-2xl">
          <AvatarImage src={club.image} />
          <AvatarFallback>{club.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 mb-2 w-full">
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-2 text-white drop-shadow-md">
            {club.name}
            {club.isPremium && <Badge className="bg-amber-500 hover:bg-amber-600 border-none text-white">Premium</Badge>}
          </h1>
          <p className="text-gray-200 font-medium">{club.category} • {club.membersCount} membros</p>
        </div>
        <div className="mb-2 flex gap-2 w-full md:w-auto">
            {isVisitorView ? (
                <Button size="lg" className="w-full md:w-auto bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20" onClick={handleJoin} disabled={isJoining}>
                    {isJoining ? "Entrando..." : club.type === 'paid' ? `Assinar por ${club.settings.subscriptionPrice}€` : "Entrar no Clube"}
                </Button>
            ) : (
                <div className="flex gap-2">
                    <Button variant="secondary" className="gap-2">
                        <Users className="w-4 h-4" /> Convidar
                    </Button>
                    {isAdmin && (
                        <Button variant="outline" className="gap-2" onClick={() => document.getElementById('admin-tab-trigger')?.click()}>
                            <Settings className="w-4 h-4" />
                            Gerir
                        </Button>
                    )}
                </div>
            )}
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL - LÓGICA DE VISÃO */}
      <div className="px-6">
        {isVisitorView ? (
            // --- LANDING PAGE DO CLUBE (VISITANTE) ---
            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sobre a Tribo</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="leading-relaxed text-lg text-muted-foreground">{club.description}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Benefícios Exclusivos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {club.benefits?.map((benefit, idx) => (
                                    <li key={idx} className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                                            <Check className="w-4 h-4" />
                                        </div>
                                        <span>{benefit}</span>
                                    </li>
                                )) || (
                                    <>
                                        <li className="flex items-center gap-3"><Check className="w-4 h-4 text-primary" /> Acesso ao chat exclusivo</li>
                                        <li className="flex items-center gap-3"><Check className="w-4 h-4 text-primary" /> Networking com profissionais</li>
                                        <li className="flex items-center gap-3"><Check className="w-4 h-4 text-primary" /> Conteúdos semanais</li>
                                    </>
                                )}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-6">
                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader>
                            <CardTitle className="text-center">Junte-se agora</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center space-y-4">
                            <div className="text-4xl font-bold">
                                {club.type === 'paid' ? `${club.settings.subscriptionPrice}€` : 'Grátis'}
                                {club.type === 'paid' && <span className="text-sm font-normal text-muted-foreground">/mês</span>}
                            </div>
                            <Button className="w-full bg-primary hover:bg-primary/90 h-12 text-lg" onClick={handleJoin} disabled={isJoining}>
                                {isJoining ? "Processando..." : "Entrar na Tribo"}
                            </Button>
                            <p className="text-xs text-muted-foreground">Acesso imediato após confirmação.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        ) : (
            // --- VISÃO DE MEMBRO / ADMIN ---
            <Tabs defaultValue="feed" className="w-full">
            <TabsList className="w-full justify-start bg-transparent border-b border-border rounded-none h-auto p-0 mb-6 overflow-x-auto">
                <TabsTrigger value="feed" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3 gap-2">
                    <FileText className="w-4 h-4" /> Feed
                </TabsTrigger>
                <TabsTrigger value="chat" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3 gap-2">
                    <MessageSquare className="w-4 h-4" /> Chat
                </TabsTrigger>
                <TabsTrigger value="members" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3 gap-2">
                    <Users className="w-4 h-4" /> Membros
                </TabsTrigger>
                {isAdmin && (
                    <TabsTrigger id="admin-tab-trigger" value="admin" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3 flex gap-2 ml-auto">
                        <Shield className="w-4 h-4" /> Gestão
                    </TabsTrigger>
                )}
            </TabsList>

            <TabsContent value="feed" className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        {/* Create Post */}
                        {(club.settings.allowMemberPosts || isAdmin) && <CreatePost clubId={club.id} />}
                        
                        {posts.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground border border-dashed border-border rounded-xl">
                            <p>Ainda não há publicações aqui.</p>
                            <p className="text-sm mt-2">Seja o primeiro a postar!</p>
                        </div>
                        ) : (
                        posts.map((post) => (
                            <Card key={post.id} className="border-border/50">
                            <CardHeader className="flex flex-row items-start gap-4 p-4 pb-2">
                                <Avatar>
                                <AvatarImage src={post.profiles?.avatar_url} />
                                <AvatarFallback>{post.profiles?.name?.[0] || 'U'}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-sm">{post.profiles?.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: pt })}
                                        </p>
                                    </div>
                                    {isAdmin && (
                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:bg-destructive/10">
                                            <MoreVertical className="w-3 h-3" />
                                        </Button>
                                    )}
                                </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-2 space-y-4">
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
                                {post.image_url && (
                                <div className="rounded-xl overflow-hidden border border-border/50">
                                    <img src={post.image_url} alt="Post content" className="w-full h-auto object-cover max-h-[500px]" />
                                </div>
                                )}
                            </CardContent>
                            </Card>
                        ))
                        )}
                    </div>
                    <div className="hidden md:block space-y-6">
                        <Card>
                            <CardHeader><CardTitle className="text-sm uppercase text-muted-foreground">Sobre</CardTitle></CardHeader>
                            <CardContent><p className="text-sm">{club.description}</p></CardContent>
                        </Card>
                    </div>
                </div>
            </TabsContent>

            <TabsContent value="chat">
                <Card className="h-[500px] flex items-center justify-center text-muted-foreground border-dashed">
                    <div className="text-center">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>Canais de chat em tempo real.</p>
                        <p className="text-xs">(Funcionalidade em desenvolvimento)</p>
                    </div>
                </Card>
            </TabsContent>

            <TabsContent value="members">
                <Card>
                    <CardHeader>
                        <CardTitle>Membros ({club.members.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {club.members.map((member) => (
                            <div key={member.userId} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={member.user.avatar} />
                                        <AvatarFallback>{member.user.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{member.user.name}</p>
                                        <p className="text-xs text-muted-foreground capitalize">{member.role}</p>
                                    </div>
                                </div>
                                {isAdmin && member.userId !== currentUser?.id && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleRoleChange(member.userId, 'admin')}>Promover a Admin</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleRoleChange(member.userId, 'moderator')}>Promover a Moderador</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleRoleChange(member.userId, 'member')}>Rebaixar a Membro</DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-500">Banir</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </TabsContent>

            {isAdmin && (
                <TabsContent value="admin" className="space-y-6">
                    {/* Invites System */}
                    <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                        <LinkIcon className="w-5 h-5 text-primary" />
                        Convites
                        </CardTitle>
                        <CardDescription>Gere links para convidar novos membros.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                        <Input 
                            value={inviteLink} 
                            placeholder="Clique em gerar para criar um link" 
                            readOnly 
                            className="bg-secondary/50"
                        />
                        {inviteLink ? (
                            <Button onClick={copyInvite} variant="outline" size="icon">
                            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </Button>
                        ) : (
                            <Button onClick={handleGenerateInvite}>Gerar Link</Button>
                        )}
                        </div>
                    </CardContent>
                    </Card>

                    {/* Monetization Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-green-500" />
                                Monetização & Preço
                            </CardTitle>
                            <CardDescription>Defina quanto custa para entrar ou permanecer na tribo.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Preço da Assinatura (Mensal)</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-muted-foreground">€</span>
                                        <Input 
                                            type="number" 
                                            className="pl-8" 
                                            value={price} 
                                            onChange={(e) => setPrice(Number(e.target.value))} 
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Moeda</Label>
                                    <Select defaultValue="EUR">
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="EUR">Euro (€)</SelectItem>
                                            <SelectItem value="USD">Dólar ($)</SelectItem>
                                            <SelectItem value="AKZ">Kwanza (Kz)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <Button onClick={handleSaveSettings}>Atualizar Preço</Button>
                        </CardContent>
                    </Card>

                    {/* Permissions & Restrictions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Lock className="w-5 h-5 text-primary" />
                                Restrições & Permissões
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Membros podem postar</Label>
                                    <p className="text-sm text-muted-foreground">Se desativado, apenas admins postam.</p>
                                </div>
                                <Switch 
                                    checked={club.settings.allowMemberPosts} 
                                    onCheckedChange={(c) => updateClubSettings(club.id, { allowMemberPosts: c })}
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Aprovação de Posts</Label>
                                    <p className="text-sm text-muted-foreground">Posts precisam de aprovação de moderadores.</p>
                                </div>
                                <Switch 
                                    checked={club.settings.requireApproval}
                                    onCheckedChange={(c) => updateClubSettings(club.id, { requireApproval: c })}
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Clube Privado</Label>
                                    <p className="text-sm text-muted-foreground">Apenas convidados podem ver o conteúdo.</p>
                                </div>
                                <Switch 
                                    checked={club.settings.isPrivate}
                                    onCheckedChange={(c) => updateClubSettings(club.id, { isPrivate: c })}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            )}
            </Tabs>
        )}
      </div>
    </div>
  );
}
