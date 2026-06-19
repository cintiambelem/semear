import React, { createContext, useContext, useState, useEffect } from 'react';

// Criamos um usuário falso para o sistema achar que você está logada
const MOCK_USER = {
  id: '1',
  email: 'aluna@semear.com',
  user_metadata: { full_name: 'Aluna Semear' }
};

interface AuthContextType {
  user: any;
  signIn: (e: string, p: string) => Promise<{ error: any }>;
  signUp: (e: string, p: string, n: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verifica se já fizemos login falso antes (para não deslogar se você apertar F5)
    const isLogged = localStorage.getItem('semear_auth');
    if (isLogged) {
      setUser(MOCK_USER);
    }
    setLoading(false);
  }, []);

  const signIn = async () => {
    localStorage.setItem('semear_auth', 'true');
    setUser(MOCK_USER);
    return { error: null };
  };

  const signUp = async () => {
    localStorage.setItem('semear_auth', 'true');
    setUser(MOCK_USER);
    return { error: null };
  };

  const signOut = async () => {
    localStorage.removeItem('semear_auth');
    // Limpa também o progresso das aulas ao sair
    localStorage.removeItem('semear_progress');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};