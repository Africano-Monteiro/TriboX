import { createClient } from '@supabase/supabase-js';

// Instruções para o usuário:
// Crie um arquivo .env na raiz do projeto com as seguintes chaves:
// VITE_SUPABASE_URL=sua_url_do_supabase
// VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos auxiliares para o Supabase (Baseado no Schema solicitado)
export type Profile = {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  website: string;
  xp: number;
  level: number;
  coins: number;
};
