import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useStore } from '@/store/useStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Image as ImageIcon, Loader2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

const postSchema = z.object({
  content: z.string().min(1, "O post não pode estar vazio."),
  imageUrl: z.string().url("URL inválida").optional().or(z.literal('')),
});

type PostFormValues = z.infer<typeof postSchema>;

interface CreatePostProps {
  clubId?: string;
}

export function CreatePost({ clubId }: CreatePostProps) {
  const { currentUser, createPost } = useStore();
  const { toast } = useToast();
  const [showImageInput, setShowImageInput] = useState(false);

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: '',
      imageUrl: ''
    }
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: PostFormValues) => {
    const { error } = await createPost(data.content, data.imageUrl, clubId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao publicar",
        description: "Não foi possível enviar seu post. Tente novamente.",
      });
      return;
    }

    toast({
      title: "Publicado!",
      description: "Sua mensagem foi enviada para o feed.",
    });
    
    form.reset();
    setShowImageInput(false);
  };

  if (!currentUser) return null;

  return (
    <Card className="border-border/50 bg-card/50 mb-6">
      <div className="p-4">
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage src={currentUser.avatar} />
            <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea 
                          placeholder={clubId ? "Partilhe algo com a tribo..." : "O que está a acontecer?"}
                          className="bg-transparent border-none resize-none focus-visible:ring-0 p-0 text-lg min-h-[60px]"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {showImageInput && (
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem className="animate-in fade-in slide-in-from-top-2">
                        <div className="flex gap-2 items-center">
                          <FormControl>
                            <Input 
                              placeholder="https://exemplo.com/imagem.jpg" 
                              className="bg-secondary/50"
                              disabled={isSubmitting}
                              {...field} 
                            />
                          </FormControl>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              setShowImageInput(false);
                              form.setValue('imageUrl', '');
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="sm" 
                    className="text-muted-foreground hover:text-primary"
                    onClick={() => setShowImageInput(!showImageInput)}
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Foto/Vídeo
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-primary hover:bg-primary/90 rounded-full px-6"
                    disabled={isSubmitting || !form.watch('content').trim()}
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Publicar"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </Card>
  );
}
