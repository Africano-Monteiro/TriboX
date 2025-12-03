import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Users, Zap, Shield, Globe, ArrowRight, CheckCircle2 } from 'lucide-react';

export function Landing() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Tribo<span className="text-primary">X</span></h1>
        </div>
        <div className="flex gap-4">
          <Link to="/login">
            <Button variant="ghost">Entrar</Button>
          </Link>
          <Link to="/register">
            <Button className="bg-primary hover:bg-primary/90">Começar Grátis</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section 
        className="py-20 px-6 text-center max-w-5xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 inline-block border border-primary/20">
            A plataforma definitiva para comunidades
          </span>
        </motion.div>
        
        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500">
          Crie. Monetize. <br />
          <span className="text-primary">Escale sua Tribo.</span>
        </motion.h1>
        
        <motion.p variants={itemVariants} className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          O sistema completo para criadores, educadores e marcas. Crie clubes exclusivos, venda conteúdos e engaje sua audiência num só lugar.
        </motion.p>
        
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register">
            <Button size="lg" className="h-12 px-8 text-lg bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
              Criar Minha Comunidade
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="h-12 px-8 text-lg">
            Ver Demo
          </Button>
        </motion.div>
      </motion.section>

      {/* Features Grid */}
      <section className="py-20 bg-secondary/30 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -5 }}
              className="p-8 rounded-2xl bg-card border border-border/50 shadow-xl"
            >
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-6">
                <Globe className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Espaços Personalizados</h3>
              <p className="text-muted-foreground">
                Crie salas de chat, feeds de notícias e bibliotecas de conteúdo. Sua tribo, suas regras.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="p-8 rounded-2xl bg-card border border-border/50 shadow-xl"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Monetização Poderosa</h3>
              <p className="text-muted-foreground">
                Venda assinaturas, cursos, e-books e receba doações. Sistema de pagamentos integrado.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="p-8 rounded-2xl bg-card border border-border/50 shadow-xl"
            >
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Gestão Completa</h3>
              <p className="text-muted-foreground">
                Defina admins, modere conteúdo e analise o crescimento da sua comunidade com métricas detalhadas.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Planos Flexíveis</h2>
          <p className="text-muted-foreground">Comece grátis e cresça sem limites.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="p-8 rounded-2xl border border-border bg-card/50">
            <h3 className="text-2xl font-bold mb-2">Starter</h3>
            <div className="text-4xl font-bold mb-6">Grátis</div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> 1 Clube</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> 100 Membros</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> Taxa de 10% nas vendas</li>
            </ul>
            <Button className="w-full" variant="outline">Começar Agora</Button>
          </div>

          <div className="p-8 rounded-2xl border border-primary bg-primary/5 relative">
            <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
            <h3 className="text-2xl font-bold mb-2">Pro</h3>
            <div className="text-4xl font-bold mb-6">29€ <span className="text-lg font-normal text-muted-foreground">/mês</span></div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> Clubes Ilimitados</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> Membros Ilimitados</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> Taxa de 2% nas vendas</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> Domínio Personalizado</li>
            </ul>
            <Button className="w-full bg-primary hover:bg-primary/90">Assinar Pro</Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-border text-center text-muted-foreground text-sm">
        <p>© 2025 TriboX Club. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
