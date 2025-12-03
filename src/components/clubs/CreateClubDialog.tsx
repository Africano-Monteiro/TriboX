import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useStore } from '@/store/useStore';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  category: z.string().min(1, "Selecione uma categoria"),
  type: z.enum(["public", "private", "paid"]),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
  image: z.string().url("URL da imagem inválida").optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateClubDialog() {
  const { addClub } = useStore();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'public',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60'
    }
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    const { error } = await addClub({
      name: data.name,
      category: data.category,
      type: data.type,
      description: data.description,
      image: data.image || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60'
    });
    setIsSubmitting(false);
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao criar clube",
        description: "Não foi possível criar sua tribo. Tente novamente.",
      });
      return;
    }

    toast({
      title: "Clube criado com sucesso!",
      description: `A tribo "${data.name}" já está ativa.`,
    });
    
    setOpen(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" />
          Criar Clube
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Criar Nova Tribo</DialogTitle>
          <DialogDescription>
            Crie um espaço para sua comunidade. Configure os detalhes básicos abaixo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Tribo</Label>
            <Input id="name" placeholder="Ex: Devs de React" {...register('name')} disabled={isSubmitting} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select onValueChange={(val) => setValue('category', val)} disabled={isSubmitting}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tech">Tecnologia</SelectItem>
                  <SelectItem value="Art">Arte & Design</SelectItem>
                  <SelectItem value="Business">Negócios</SelectItem>
                  <SelectItem value="Health">Saúde</SelectItem>
                  <SelectItem value="Gaming">Gaming</SelectItem>
                  <SelectItem value="Other">Outros</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select onValueChange={(val: any) => setValue('type', val)} defaultValue="public" disabled={isSubmitting}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Público</SelectItem>
                  <SelectItem value="private">Privado (Convite)</SelectItem>
                  <SelectItem value="paid">Pago (Premium)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea 
              id="description" 
              placeholder="Sobre o que é esta tribo?" 
              className="resize-none" 
              {...register('description')}
              disabled={isSubmitting}
            />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">URL da Imagem de Capa</Label>
            <div className="flex gap-2">
                <Input id="image" placeholder="https://..." {...register('image')} disabled={isSubmitting} />
                <Button type="button" variant="outline" size="icon" disabled={isSubmitting}>
                    <ImageIcon className="w-4 h-4" />
                </Button>
            </div>
            <p className="text-[10px] text-muted-foreground">Deixe em branco para usar uma imagem padrão.</p>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={isSubmitting}>Cancelar</Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Criando...</> : "Criar Clube"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
