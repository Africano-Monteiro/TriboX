import { useStore } from '@/store/useStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Globe, Moon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function Settings() {
  const { appSettings, updateAppSettings } = useStore();
  const { toast } = useToast();

  const handleSave = () => {
    toast({
        title: "Preferências Salvas",
        description: "Suas configurações foram atualizadas com sucesso.",
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <header>
        <h1 className="text-3xl font-bold mb-2">Definições</h1>
        <p className="text-muted-foreground">Gerencie suas preferências globais da plataforma.</p>
      </header>

      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5" /> Idioma e Região</CardTitle>
            <CardDescription>Ajuste como o TriboX aparece para você.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label>Idioma da Interface</Label>
                    <Select 
                        value={appSettings.language} 
                        onValueChange={(val) => updateAppSettings({ language: val })}
                    >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pt-PT">Português (Portugal)</SelectItem>
                            <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                            <SelectItem value="en-US">English (US)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Moeda Principal</Label>
                    <Select 
                        value={appSettings.currency}
                        onValueChange={(val) => updateAppSettings({ currency: val })}
                    >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="EUR">Euro (€)</SelectItem>
                            <SelectItem value="AKZ">Kwanza (Kz)</SelectItem>
                            <SelectItem value="USD">Dólar ($)</SelectItem>
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Usada para mostrar preços no marketplace.</p>
                </div>
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Moon className="w-5 h-5" /> Aparência</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <Label>Modo Escuro</Label>
                    <p className="text-sm text-muted-foreground">Alternar entre tema claro e escuro.</p>
                </div>
                <Switch 
                    checked={appSettings.theme === 'dark'} 
                    onCheckedChange={(checked) => updateAppSettings({ theme: checked ? 'dark' : 'light' })}
                />
            </div>
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <Label>Animações Reduzidas</Label>
                    <p className="text-sm text-muted-foreground">Para computadores mais lentos.</p>
                </div>
                <Switch 
                    checked={appSettings.reducedMotion}
                    onCheckedChange={(checked) => updateAppSettings({ reducedMotion: checked })}
                />
            </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button className="bg-primary" onClick={handleSave}>Salvar Preferências</Button>
      </div>
    </div>
  );
}
