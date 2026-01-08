'use client';

import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import { useTheme } from '@/components/providers/ThemeProvider';
import { Search, Plus, User, Menu, X, Sun, Moon, LogOut, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme, mounted } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  };

  return (
    <header 
      className="sticky top-0 z-50"
      style={{ 
        background: 'var(--bg)', 
        borderBottom: '1px solid var(--border)' 
      }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div 
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold"
              style={{ background: 'var(--orange)' }}
            >
              M
            </div>
            <span className="font-bold text-lg hidden sm:block" style={{ color: 'var(--text)' }}>
              lemauvais<span style={{ color: 'var(--orange)' }}>coin</span>
            </span>
          </Link>

          {/* Search - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:block flex-1 max-w-md mx-6">
            <div className="relative">
              <Search 
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" 
                style={{ color: 'var(--text-muted)' }} 
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher..."
                className="input-search"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              {mounted && (theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />)}
            </button>

            {isAuthenticated ? (
              <>
                <div className="relative hidden md:block">
                  <button 
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
                    style={{ 
                      background: userMenuOpen ? 'var(--bg-tertiary)' : 'transparent',
                      color: 'var(--text)'
                    }}
                  >
                    <div 
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-medium"
                      style={{ background: 'var(--orange)' }}
                    >
                      {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                  </button>
                  
                  {userMenuOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <div 
                        className="absolute right-0 mt-1 w-48 py-1 rounded-lg shadow-lg z-20"
                        style={{ 
                          background: 'var(--bg)',
                          border: '1px solid var(--border)'
                        }}
                      >
                        <div className="px-3 py-2 border-b" style={{ borderColor: 'var(--border)' }}>
                          <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                            {user?.firstName || 'Mon compte'}
                          </p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            {user?.email}
                          </p>
                        </div>
                        <Link 
                          href="/profile" 
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
                          style={{ color: 'var(--text)' }}
                        >
                          <User className="w-4 h-4" />
                          Mon profil
                        </Link>
                        <button 
                          onClick={handleLogout}
                          className="flex items-center gap-2 px-3 py-2 text-sm w-full hover:bg-gray-50 dark:hover:bg-gray-800"
                          style={{ color: 'var(--red)' }}
                        >
                          <LogOut className="w-4 h-4" />
                          Déconnexion
                        </button>
                      </div>
                    </>
                  )}
                </div>
                
                <Link href="/ads/new" className="btn-orange">
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Déposer</span>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="btn-ghost hidden md:flex">
                  Connexion
                </Link>
                <Link href="/ads/new" className="btn-orange">
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Déposer</span>
                </Link>
              </>
            )}
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg"
              style={{ color: 'var(--text)' }}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <form onSubmit={handleSearch} className="md:hidden pb-3">
          <div className="relative">
            <Search 
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" 
              style={{ color: 'var(--text-muted)' }} 
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher..."
              className="input-search"
            />
          </div>
        </form>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden border-t"
          style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
        >
          <div className="px-4 py-3 space-y-1">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 py-3 mb-2" style={{ borderBottom: '1px solid var(--border)' }}>
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                    style={{ background: 'var(--orange)' }}
                  >
                    {user?.firstName?.[0] || 'U'}
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--text)' }}>
                      {user?.firstName || 'Utilisateur'}
                    </p>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      {user?.email}
                    </p>
                  </div>
                </div>
                <Link 
                  href="/profile" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="flex items-center gap-3 py-2.5 px-2 rounded-lg"
                  style={{ color: 'var(--text)' }}
                >
                  <User className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                  Mon profil
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="flex items-center gap-3 py-2.5 px-2 rounded-lg w-full"
                  style={{ color: 'var(--red)' }}
                >
                  <LogOut className="w-5 h-5" />
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="block py-2.5 px-2 rounded-lg font-medium"
                  style={{ color: 'var(--text)' }}
                >
                  Connexion
                </Link>
                <Link 
                  href="/register" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="block py-2.5 px-2 rounded-lg font-medium"
                  style={{ color: 'var(--orange)' }}
                >
                  Créer un compte
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
