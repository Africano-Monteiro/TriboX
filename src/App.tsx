import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Home } from './pages/Home';
import { Wallet } from './pages/Wallet';
import { Marketplace } from './pages/Marketplace';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Landing } from './pages/Landing';
import { ClubDetail } from './pages/ClubDetail';
import { Explore } from './pages/Explore';
import { Settings } from './pages/Settings';
import { Toaster } from '@/components/ui/toaster';
import { useStore } from '@/store/useStore';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Componente simples para proteger rotas
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { currentUser, isLoading } = useStore();
  
  if (isLoading) {
      return <div className="h-screen w-full flex items-center justify-center bg-background"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Rota pública que redireciona para home se já logado
const PublicRoute = ({ children }: { children: JSX.Element }) => {
    const { currentUser, isLoading } = useStore();
    
    if (isLoading) {
         return <div className="h-screen w-full flex items-center justify-center bg-background"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    }

    if (currentUser) {
      return <Navigate to="/app" replace />;
    }
    return children;
};

function App() {
  const { checkSession, fetchMyClubs } = useStore();

  useEffect(() => {
    // Verifica sessão inicial
    checkSession();

    // Escuta mudanças na autenticação (Login, Logout, Token Refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        await checkSession();
        await fetchMyClubs(); // Carrega os clubes assim que logar
      } else if (event === 'SIGNED_OUT') {
        checkSession(); // Limpa o estado
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <Router>
      <Routes>
        {/* Landing Page é a raiz se não estiver logado */}
        <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />

        {/* Auth Routes */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* App Routes (Protegidas) */}
        <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index element={<Home />} />
          <Route path="explore" element={<Explore />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="settings" element={<Settings />} />
          
          {/* Club Routes */}
          <Route path="clubs/:id" element={<ClubDetail />} />
          <Route path="clubs" element={<div className="p-8">Lista de Clubes (Use a Sidebar)</div>} />
          
          <Route path="events" element={<div className="p-8">Página de Eventos (Em construção)</div>} />
          <Route path="messages" element={<div className="p-8">Mensagens (Em construção)</div>} />
          <Route path="notifications" element={<div className="p-8">Notificações (Em construção)</div>} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
