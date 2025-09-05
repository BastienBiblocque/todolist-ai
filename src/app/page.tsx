

import Link from 'next/link';
import { cookies } from 'next/headers';

export default async function Home() {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get('token');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-purple-800 mb-8">
            Bienvenue sur TodoList
          </h1>
          
          <p className="text-xl text-gray-700 mb-12">
            Une application moderne pour gérer vos tâches quotidiennes
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white/80 p-8 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-semibold text-purple-700 mb-4">
                Fonctionnalités
              </h2>
              <ul className="text-left space-y-3">
                <li className="flex items-center text-gray-700 hover:text-purple-700 transition-colors">
                  <svg className="w-5 h-5 text-purple-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                  <span className="font-medium">Gestion des tâches simple et intuitive</span>
                </li>
                <li className="flex items-center text-gray-700 hover:text-purple-700 transition-colors">
                  <svg className="w-5 h-5 text-purple-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                  <span className="font-medium">Authentification sécurisée</span>
                </li>
                <li className="flex items-center text-gray-700 hover:text-purple-700 transition-colors">
                  <svg className="w-5 h-5 text-purple-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                  <span className="font-medium">Stockage persistant avec PostgreSQL</span>
                </li>
              </ul>
            </div>

            <div className="bg-white/80 p-8 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-semibold text-purple-700 mb-4">
                Technologies
              </h2>
              <ul className="text-left space-y-3">
                <li className="flex items-center text-gray-700 hover:text-purple-700 transition-colors">
                  <svg className="w-5 h-5 text-purple-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                  <span className="font-medium hover:text-purple-700">Next.js 14 avec App Router</span>
                </li>
                <li className="flex items-center text-gray-700 hover:text-purple-700 transition-colors">
                  <svg className="w-5 h-5 text-purple-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                  <span className="font-medium">TypeScript & Tailwind CSS</span>
                </li>
                <li className="flex items-center text-gray-700 hover:text-purple-700 transition-colors">
                  <svg className="w-5 h-5 text-purple-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                  <span className="font-medium">Prisma ORM & PostgreSQL</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-4 md:space-y-0 md:space-x-4">
            {isAuthenticated ? (
              <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
                <Link 
                  href="/todo"
                  className="w-full md:w-auto inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors text-lg"
                >
                  Accéder à mes tâches
                </Link>
                <span className="text-purple-700">ou</span>
                <Link 
                  href="/todo"
                  className="w-full md:w-auto inline-block bg-white border-2 border-purple-600 hover:bg-purple-50 text-purple-600 font-semibold px-8 py-4 rounded-lg transition-colors text-lg"
                >
                  Commencer une nouvelle liste
                </Link>
              </div>
            ) : (
              <>
                <Link 
                  href="/login"
                  className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors text-lg"
                >
                  Se connecter
                </Link>
                <Link 
                  href="/register"
                  className="inline-block bg-white border-2 border-purple-600 hover:bg-purple-50 text-purple-600 font-semibold px-8 py-4 rounded-lg transition-colors text-lg"
                >
                  Créer un compte
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      
      <footer className="absolute bottom-0 w-full py-4 text-center text-gray-600">
        © {new Date().getFullYear()} TodoList App - Tous droits réservés
      </footer>
    </div>
  );
}
