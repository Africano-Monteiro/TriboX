import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { pt } from 'date-fns/locale';
import { CreatePost } from '@/components/feed/CreatePost';

export function Home() {
  const { posts, fetchPosts } = useStore();

  useEffect(() => {
    fetchPosts(); // Busca posts globais/recentes
  }, []);

  return (
    <div className="max-w-2xl mx-auto pb-20">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border p-4">
        <h1 className="text-2xl font-bold">Início</h1>
      </header>

      <div className="p-4 space-y-6">
        {/* Create Post Component */}
        <CreatePost />

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full justify-start bg-transparent border-b border-border rounded-none h-auto p-0">
            <TabsTrigger value="all" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3">Tudo</TabsTrigger>
            <TabsTrigger value="posts" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3">Posts</TabsTrigger>
            <TabsTrigger value="events" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3">Eventos</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6 mt-6">
            {posts.map((post) => (
              <Card key={post.id} className="border-border/50 overflow-hidden">
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
                                {post.clubs?.name ? (
                                  <>Postado em <span className="text-primary">{post.clubs.name}</span> • </>
                                ) : null}
                                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: pt })}
                            </p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                        </Button>
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
                <CardFooter className="p-4 pt-0 flex items-center justify-between text-muted-foreground">
                    <Button variant="ghost" size="sm" className="gap-2 hover:text-primary">
                        <Heart className="w-4 h-4" />
                        {post.likes_count}
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2 hover:text-primary">
                        <MessageCircle className="w-4 h-4" />
                        {post.comments_count}
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2 hover:text-primary">
                        <Share2 className="w-4 h-4" />
                    </Button>
                </CardFooter>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
