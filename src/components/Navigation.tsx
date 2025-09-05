'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Vérifier si le token existe dans les cookies
    const hasToken = document.cookie.includes('authToken=');
    setIsAuthenticated(hasToken);
  }, [pathname]); // Re-vérifier quand le chemin change

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold hover:text-purple-400 transition-colors">
          TodoList App
        </Link>
        <div className="space-x-6">
          <Link 
            href="/" 
            className={`hover:text-purple-400 transition-colors ${
              pathname === '/' ? 'text-purple-400' : ''
            }`}
          >
            Accueil
          </Link>
          {isAuthenticated ? (
            <>
              <Link 
                href="/todo" 
                className={`hover:text-purple-400 transition-colors ${
                  pathname === '/todo' ? 'text-purple-400' : ''
                }`}
              >
                Mes Tâches
              </Link>
              <button 
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/login" 
                className={`hover:text-purple-400 transition-colors ${
                  pathname === '/login' ? 'text-purple-400' : ''
                }`}
              >
                Connexion
              </Link>
              <Link 
                href="/register" 
                className={`hover:text-purple-400 transition-colors ${
                  pathname === '/register' ? 'text-purple-400' : ''
                }`}
              >
                Inscription
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
