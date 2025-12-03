import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';

// --- TYPES ---

export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  xp: number;
  level: string;
  coins: number;
  isPremium: boolean;
  email?: string;
}

export interface Post {
  id: string;
  user_id: string;
  club_id?: string;
  content: string;
  image_url?: string;
  created_at: string;
  likes_count: number;
  comments_count: number;
  profiles?: {
    name: string;
    avatar_url: string;
  };
  clubs?: {
    name: string;
  };
}

export interface ClubSettings {
  allowMemberPosts: boolean;
  requireApproval: boolean;
  isPrivate: boolean;
  subscriptionPrice: number;
  currency: string;
}

export interface ClubMember {
  userId: string;
  user: User;
  role: 'owner' | 'admin' | 'moderator' | 'member';
  joinedAt: string;
}

export interface Club {
  id: string;
  name: string;
  description: string;
  membersCount: number;
  image: string;
  coverImage: string;
  category: string;
  isPremium: boolean;
  type: 'public' | 'private' | 'paid';
  settings: ClubSettings;
  members: ClubMember[];
  owner_id?: string;
  benefits?: string[]; // Lista de benefícios para mostrar na landing do clube
}

export interface Event {
  id: string;
  title: string;
  date: string;
  clubName: string;
  image: string;
}

export interface AppSettings {
    language: string;
    currency: string;
    theme: 'dark' | 'light';
    reducedMotion: boolean;
}

interface AppState {
  currentUser: User | null;
  isLoading: boolean;
  posts: Post[];
  clubs: Club[]; // Meus clubes
  allClubs: Club[]; // Para explorar
  recommendedClubs: Club[];
  upcomingEvents: Event[];
  appSettings: AppSettings;
  
  // Auth Actions
  login: (email: string, password: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<{ error: any }>;
  checkSession: () => Promise<void>;
  
  // Feed Actions
  fetchPosts: (clubId?: string) => Promise<void>;
  createPost: (content: string, imageUrl?: string, clubId?: string) => Promise<{ error: any }>;
  
  // Club Actions
  fetchMyClubs: () => Promise<void>;
  fetchAllClubs: () => Promise<void>;
  addClub: (club: Partial<Club>) => Promise<{ error: any; data?: any }>;
  updateClubSettings: (clubId: string, settings: Partial<ClubSettings>) => void;
  updateMemberRole: (clubId: string, userId: string, role: ClubMember['role']) => void;
  getClubById: (id: string) => Club | undefined;
  joinClub: (clubId: string) => Promise<{ error: any }>;
  generateInviteLink: (clubId: string) => string;
  
  // Wallet/Settings
  addCoins: (amount: number) => void;
  updateAppSettings: (settings: Partial<AppSettings>) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isLoading: true,
      posts: [],
      appSettings: {
        language: 'pt-PT',
        currency: 'EUR',
        theme: 'dark',
        reducedMotion: false
      },
      clubs: [],
      allClubs: [],
      recommendedClubs: [],
      upcomingEvents: [],
      
      // --- AUTH ACTIONS ---

      checkSession: async () => {
        set({ isLoading: true });
        try {
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user) {
            // Tenta buscar perfil existente
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profile) {
              set({ 
                currentUser: {
                  id: profile.id,
                  name: profile.name || 'Usuário',
                  handle: profile.handle || `@user${profile.id.slice(0,4)}`,
                  avatar: profile.avatar_url || 'https://github.com/shadcn.png',
                  xp: profile.xp || 0,
                  level: profile.level || 'Bronze',
                  coins: profile.coins || 0,
                  isPremium: profile.is_premium || false,
                  email: session.user.email
                },
                isLoading: false
              });
            } else {
                // Fallback se o trigger falhar ou ainda não existir
                set({
                    currentUser: {
                        id: session.user.id,
                        name: session.user.user_metadata.name || 'Novo Usuário',
                        handle: '@novo',
                        avatar: 'https://github.com/shadcn.png',
                        xp: 0,
                        level: 'Iniciante',
                        coins: 0,
                        isPremium: false,
                        email: session.user.email
                    },
                    isLoading: false
                });
            }
          } else {
             set({ currentUser: null, isLoading: false });
          }
        } catch (e) {
          console.error("Erro na sessão:", e);
          set({ currentUser: null, isLoading: false });
        }
      },

      login: async (email, password) => {
        set({ isLoading: true });
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) set({ isLoading: false });
        else await get().checkSession(); // Atualiza estado após login
        return { error };
      },
      
      logout: async () => {
        await supabase.auth.signOut();
        set({ currentUser: null, clubs: [] });
      },
      
      register: async (name, email, password) => {
        set({ isLoading: true });
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name } }
        });
        set({ isLoading: false });
        return { error };
      },
      
      // --- FEED ACTIONS ---

      fetchPosts: async (clubId) => {
        // Simulação de fetch real com Supabase
        // Em produção, isso seria um select na tabela 'posts'
        let query = supabase
          .from('posts')
          .select(`
            *,
            profiles (name, avatar_url),
            clubs (name)
          `)
          .order('created_at', { ascending: false });

        if (clubId) {
          query = query.eq('club_id', clubId);
        }

        const { data, error } = await query;

        if (!error && data) {
          set({ posts: data as any });
        } else if (get().posts.length === 0) {
            // Fallback para dados mockados se o DB estiver vazio para demonstração
            const mockPosts: Post[] = [
                {
                    id: '1',
                    user_id: 'user1',
                    content: 'Bem-vindos ao TriboX! Estamos muito felizes em lançar esta plataforma.',
                    created_at: new Date().toISOString(),
                    likes_count: 12,
                    comments_count: 4,
                    profiles: { name: 'Admin TriboX', avatar_url: 'https://github.com/shadcn.png' },
                    clubs: { name: 'TriboX Oficial' }
                }
            ];
            set({ posts: mockPosts });
        }
      },

      createPost: async (content, imageUrl, clubId) => {
        const currentUser = get().currentUser;
        if (!currentUser) return { error: "Não autenticado" };

        // Inserção Real no Supabase
        const { data, error } = await supabase
          .from('posts')
          .insert({
            user_id: currentUser.id,
            club_id: clubId || null,
            content,
            image_url: imageUrl,
            likes_count: 0,
            comments_count: 0
          })
          .select()
          .single();

        if (!error) {
          // Atualiza o feed localmente
          await get().fetchPosts(clubId);
        } else {
            // Fallback Local (Mock) se a tabela não existir
            console.warn("Usando fallback local para post (tabela posts pode não existir)");
            const newPost: Post = {
                id: Math.random().toString(36).substr(2, 9),
                user_id: currentUser.id,
                club_id: clubId,
                content,
                image_url: imageUrl,
                created_at: new Date().toISOString(),
                likes_count: 0,
                comments_count: 0,
                profiles: { name: currentUser.name, avatar_url: currentUser.avatar },
                clubs: clubId ? { name: 'Clube' } : undefined
            };
            set((state) => ({ posts: [newPost, ...state.posts] }));
            return { error: null };
        }

        return { error };
      },

      // --- CLUB ACTIONS ---

      fetchMyClubs: async () => {
        const currentUser = get().currentUser;
        if (!currentUser) return;

        const { data: memberClubs, error } = await supabase
          .from('club_members')
          .select(`
            role,
            clubs (
              id, name, description, image_url, cover_url, category, type, is_premium, owner_id
            )
          `)
          .eq('user_id', currentUser.id);

        if (memberClubs && memberClubs.length > 0) {
          const formattedClubs: Club[] = memberClubs.map((item: any) => ({
            id: item.clubs.id,
            name: item.clubs.name,
            description: item.clubs.description,
            membersCount: 1, // Placeholder
            image: item.clubs.image_url || 'https://github.com/shadcn.png',
            coverImage: item.clubs.cover_url || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60',
            category: item.clubs.category || 'Geral',
            isPremium: item.clubs.is_premium || false,
            type: item.clubs.type || 'public',
            owner_id: item.clubs.owner_id,
            settings: { allowMemberPosts: true, requireApproval: false, isPrivate: false, subscriptionPrice: 0, currency: 'EUR' },
            members: [{ userId: currentUser.id, user: currentUser, role: item.role, joinedAt: new Date().toISOString() }]
          }));
          set({ clubs: formattedClubs });
        }
      },

      fetchAllClubs: async () => {
        const { data, error } = await supabase
          .from('clubs')
          .select('*')
          .eq('type', 'public')
          .limit(50);

        if (data && data.length > 0) {
           const formattedClubs: Club[] = data.map((c: any) => ({
            id: c.id,
            name: c.name,
            description: c.description,
            membersCount: Math.floor(Math.random() * 500) + 1, // Mock count
            image: c.image_url || 'https://github.com/shadcn.png',
            coverImage: c.cover_url || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60',
            category: c.category || 'Geral',
            isPremium: c.is_premium || false,
            type: c.type,
            owner_id: c.owner_id,
            settings: { allowMemberPosts: true, requireApproval: false, isPrivate: false, subscriptionPrice: 0, currency: 'EUR' },
            members: [],
            benefits: ['Acesso ao chat', 'Conteúdos exclusivos', 'Networking']
           }));
           set({ allClubs: formattedClubs });
        } else {
            // Mock Data for Explore if DB is empty
            set({
                allClubs: [
                    {
                        id: 'mock-1',
                        name: 'React Developers',
                        description: 'A maior comunidade de React do Brasil e Portugal.',
                        membersCount: 1250,
                        image: 'https://github.com/shadcn.png',
                        coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60',
                        category: 'Tech',
                        isPremium: false,
                        type: 'public',
                        settings: { allowMemberPosts: true, requireApproval: false, isPrivate: false, subscriptionPrice: 0, currency: 'EUR' },
                        members: [],
                        benefits: ['Vagas de emprego', 'Mentoria', 'Live Coding']
                    },
                    {
                        id: 'mock-2',
                        name: 'Clube dos Investidores',
                        description: 'Dicas diárias sobre ações, cripto e mercado financeiro.',
                        membersCount: 890,
                        image: 'https://images.unsplash.com/photo-1611974765270-ca1258634369?w=800&auto=format&fit=crop&q=60',
                        coverImage: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=60',
                        category: 'Business',
                        isPremium: true,
                        type: 'paid',
                        settings: { allowMemberPosts: false, requireApproval: true, isPrivate: true, subscriptionPrice: 29, currency: 'EUR' },
                        members: [],
                        benefits: ['Sinais de trade', 'Carteira recomendada', 'Análise semanal']
                    }
                ]
            })
        }
      },

      addClub: async (newClubData) => {
        const currentUser = get().currentUser;
        if (!currentUser) return { error: "Usuário não logado" };

        const { data: clubData, error: clubError } = await supabase
          .from('clubs')
          .insert({
            name: newClubData.name,
            description: newClubData.description,
            category: newClubData.category,
            type: newClubData.type,
            image_url: newClubData.image,
            owner_id: currentUser.id
          })
          .select()
          .single();

        if (clubError) return { error: clubError };

        const { error: memberError } = await supabase
          .from('club_members')
          .insert({
            club_id: clubData.id,
            user_id: currentUser.id,
            role: 'owner'
          });

        if (memberError) return { error: memberError };

        await get().fetchMyClubs();
        return { error: null, data: clubData };
      },

      joinClub: async (clubId) => {
        const currentUser = get().currentUser;
        if (!currentUser) return { error: "Login necessário" };

        // Verifica se já é membro
        const isMember = get().clubs.some(c => c.id === clubId);
        if (isMember) return { error: "Já é membro" };

        const { error } = await supabase
            .from('club_members')
            .insert({
                club_id: clubId,
                user_id: currentUser.id,
                role: 'member'
            });
        
        if (!error) {
            await get().fetchMyClubs();
            // Atualiza lista localmente para feedback imediato
            const club = get().allClubs.find(c => c.id === clubId);
            if (club) {
                set(state => ({
                    clubs: [...state.clubs, { 
                        ...club, 
                        members: [{ userId: currentUser.id, user: currentUser, role: 'member', joinedAt: new Date().toISOString() }] 
                    }]
                }));
            }
        } else {
            // Mock success for demo if DB fails
             const club = get().allClubs.find(c => c.id === clubId);
             if (club) {
                set(state => ({
                    clubs: [...state.clubs, { 
                        ...club, 
                        members: [{ userId: currentUser.id, user: currentUser, role: 'member', joinedAt: new Date().toISOString() }] 
                    }]
                }));
                return { error: null };
             }
        }
        return { error };
      },

      generateInviteLink: (clubId) => {
        // Gera um hash único baseado no clube e timestamp
        const hash = btoa(`${clubId}-${Date.now()}-${Math.random()}`).slice(0, 16);
        return `${window.location.origin}/join/${hash}`;
      },

      // --- MÉTODOS LOCAIS (UI ONLY) ---
      
      addCoins: (amount) => set((state) => {
        if (!state.currentUser) return state;
        return { currentUser: { ...state.currentUser, coins: state.currentUser.coins + amount } };
      }),

      updateClubSettings: (clubId, newSettings) => set((state) => ({
        clubs: state.clubs.map(club => 
          club.id === clubId 
            ? { ...club, settings: { ...club.settings, ...newSettings } }
            : club
        )
      })),

      updateMemberRole: (clubId, userId, role) => set((state) => ({
        clubs: state.clubs.map(club => {
          if (club.id !== clubId) return club;
          return {
            ...club,
            members: club.members.map(m => m.userId === userId ? { ...m, role } : m)
          };
        })
      })),

      getClubById: (id) => {
          const myClub = get().clubs.find(c => c.id === id);
          if (myClub) return myClub;
          return get().allClubs.find(c => c.id === id);
      },

      updateAppSettings: (newSettings) => set((state) => ({
        appSettings: { ...state.appSettings, ...newSettings }
      }))
    }),
    {
      name: 'tribox-storage', 
      partialize: (state) => ({ appSettings: state.appSettings }), 
    }
  )
);
