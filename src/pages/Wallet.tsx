import { useStore } from '@/store/useStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, CreditCard, ArrowUpRight, History, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function Wallet() {
  const { currentUser, addCoins } = useStore();

  const coinPackages = [
    { amount: 500, price: '5,00 €', bonus: null },
    { amount: 1000, price: '9,00 €', bonus: '10%' },
    { amount: 2000, price: '17,00 €', bonus: '15%' },
    { amount: 5000, price: '40,00 €', bonus: '20%' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <header>
        <h1 className="text-3xl font-bold mb-2">Minha Carteira</h1>
        <p className="text-muted-foreground">Gerencie suas TriboCoins e assinaturas.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Balance Card */}
        <Card className="md:col-span-2 bg-gradient-to-br from-primary/20 to-background border-primary/20">
            <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Saldo Atual</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-primary">{currentUser.coins.toLocaleString()}</span>
                    <span className="text-xl font-semibold text-muted-foreground">TC</span>
                </div>
                <div className="mt-6 flex gap-3">
                    <Button className="gap-2 bg-primary hover:bg-primary/90">
                        <ArrowUpRight className="w-4 h-4" />
                        Recarregar
                    </Button>
                    <Button variant="outline" className="gap-2">
                        <History className="w-4 h-4" />
                        Histórico
                    </Button>
                </div>
            </CardContent>
        </Card>

        {/* Subscription Status */}
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    TriboX Pro
                    {currentUser.isPremium ? <Badge className="bg-amber-500">Ativo</Badge> : <Badge variant="secondary">Inativo</Badge>}
                </CardTitle>
                <CardDescription>Plano Global</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <ul className="text-sm space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2"><Zap className="w-3 h-3 text-amber-500" /> Uploads Ilimitados</li>
                    <li className="flex items-center gap-2"><Zap className="w-3 h-3 text-amber-500" /> Analytics Avançado</li>
                    <li className="flex items-center gap-2"><Zap className="w-3 h-3 text-amber-500" /> Selo Verificado</li>
                </ul>
                <Button variant="outline" className="w-full">Gerir Assinatura</Button>
            </CardContent>
        </Card>
      </div>

      {/* Buy Coins */}
      <section>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-400" />
            Comprar TriboCoins
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {coinPackages.map((pkg) => (
                <Card key={pkg.amount} className="relative overflow-hidden hover:border-primary transition-colors cursor-pointer group">
                    {pkg.bonus && (
                        <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                            +{pkg.bonus} BONUS
                        </div>
                    )}
                    <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                        <div className="w-12 h-12 rounded-full bg-amber-400/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                            <Coins className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{pkg.amount}</p>
                            <p className="text-xs text-muted-foreground uppercase">TriboCoins</p>
                        </div>
                        <Button 
                            variant="secondary" 
                            className="w-full"
                            onClick={() => addCoins(pkg.amount)}
                        >
                            {pkg.price}
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
      </section>

      {/* Payment Methods */}
      <section>
        <h2 className="text-xl font-bold mb-4">Métodos de Pagamento</h2>
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-6 bg-white rounded flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-red-500 -mr-1 mix-blend-multiply" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500 -ml-1 mix-blend-multiply" />
                        </div>
                        <div>
                            <p className="font-medium">Mastercard terminando em 8829</p>
                            <p className="text-xs text-muted-foreground">Expira em 12/26</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm">Remover</Button>
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                    <Button variant="outline" className="gap-2">
                        <CreditCard className="w-4 h-4" />
                        Adicionar Novo Cartão
                    </Button>
                </div>
            </CardContent>
        </Card>
      </section>
    </div>
  );
}
