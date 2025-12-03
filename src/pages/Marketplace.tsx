import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Video, Mic, Star, Download } from 'lucide-react';

export function Marketplace() {
  const products = [
    { id: 1, title: 'Curso React Avançado', author: 'Devs React', type: 'Course', price: 2500, rating: 4.8, image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60' },
    { id: 2, title: 'Guia de Sobrevivência', author: 'Os Aventureiros', type: 'E-book', price: 500, rating: 4.5, image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop&q=60' },
    { id: 3, title: 'Pack de Presets Lightroom', author: 'Pintores Digitais', type: 'Asset', price: 1200, rating: 4.9, image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=60' },
    { id: 4, title: 'Podcast Exclusivo: Tech Trends', author: 'Tech Insider', type: 'Audio', price: 300, rating: 4.7, image: 'https://images.unsplash.com/photo-1478737270239-2f02b77ac6d5?w=800&auto=format&fit=crop&q=60' },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
        case 'Course': return <Video className="w-4 h-4" />;
        case 'E-book': return <BookOpen className="w-4 h-4" />;
        case 'Audio': return <Mic className="w-4 h-4" />;
        default: return <Download className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <header className="flex justify-between items-end">
        <div>
            <h1 className="text-3xl font-bold mb-2">Marketplace</h1>
            <p className="text-muted-foreground">Conteúdos digitais criados pela comunidade.</p>
        </div>
        <Button variant="outline">Meus Produtos</Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
            <Card key={product.id} className="overflow-hidden flex flex-col">
                <div className="aspect-video relative">
                    <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                    <Badge className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm hover:bg-black/80 gap-1">
                        {getTypeIcon(product.type)}
                        {product.type}
                    </Badge>
                </div>
                <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-lg leading-tight">{product.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">por {product.author}</p>
                </CardHeader>
                <CardContent className="p-4 pt-2 flex-1">
                    <div className="flex items-center gap-1 text-amber-400 text-sm">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-medium text-foreground">{product.rating}</span>
                        <span className="text-muted-foreground">(128)</span>
                    </div>
                </CardContent>
                <CardFooter className="p-4 border-t border-border bg-secondary/20 flex items-center justify-between">
                    <span className="font-bold text-lg text-primary">{product.price} TC</span>
                    <Button size="sm">Comprar</Button>
                </CardFooter>
            </Card>
        ))}
      </div>
    </div>
  );
}
