'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { AdCard } from '@/components/ads/AdCard';
import { Ad, adsAPI } from '@/lib/api';
import Link from 'next/link';

const categories = [
  { name: 'Tous', value: '' },
  { name: 'Services', value: 'Services' },
  { name: 'Objets', value: 'Objets' },
  { name: 'Véhicules', value: 'Véhicules' },
  { name: 'Immobilier', value: 'Immobilier' },
  { name: 'Électronique', value: 'Électronique' },
];

function HomeContent() {
  const searchParams = useSearchParams();
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');

  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    const fetchAds = async () => {
      try {
        setLoading(true);
        setError(null);
        const params: { category?: string; search?: string } = {};
        
        if (selectedCategory) {
          params.category = selectedCategory;
        }
        if (searchQuery) {
          params.search = searchQuery;
        }
        
        const response = await adsAPI.getAll(params);
        setAds(response.ads || []);
      } catch (err) {
        console.error('Error fetching ads:', err);
        setError('Erreur de chargement');
        setAds([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, [selectedCategory, searchQuery]);

  return (
    <>
      {/* Banner */}
      <div style={{ background: 'var(--orange)' }}>
        <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
          <h1 className="text-xl md:text-3xl font-semibold text-white mb-2">
            Petites annonces
          </h1>
          <p className="text-white/70 text-sm mb-5">
            Achetez et vendez près de chez vous
          </p>
          <Link 
            href="/ads/new" 
            className="inline-block bg-white/90 hover:bg-white px-4 py-2 rounded text-sm font-medium"
            style={{ color: 'var(--orange)' }}
          >
            Déposer une annonce
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: 'var(--bg-alt)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-2 py-3 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.value)}
                className="px-3 py-1.5 rounded text-sm whitespace-nowrap transition-colors"
                style={{
                  background: selectedCategory === cat.value ? 'var(--orange)' : 'var(--bg-muted)',
                  color: selectedCategory === cat.value ? 'white' : 'var(--text-secondary)'
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ background: 'var(--bg)' }} className="min-h-[50vh]">
        <div className="max-w-5xl mx-auto px-4 py-6">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-medium" style={{ color: 'var(--text)' }}>
                {searchQuery ? `Résultats : ${searchQuery}` : 'Annonces récentes'}
              </h2>
              {!loading && (
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {ads.length} annonce{ads.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>
            {ads.length > 0 && !loading && (
              <select 
                className="text-xs px-2 py-1 rounded"
                style={{ 
                  background: 'var(--bg-alt)', 
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)'
                }}
              >
                <option>Plus récentes</option>
                <option>Prix croissant</option>
                <option>Prix décroissant</option>
              </select>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {[...Array(10)].map((_, i) => (
                <div 
                  key={i} 
                  className="rounded-lg overflow-hidden"
                  style={{ background: 'var(--bg-alt)', border: '1px solid var(--border)' }}
                >
                  <div className="aspect-square animate-pulse" style={{ background: 'var(--bg-muted)' }} />
                  <div className="p-3 space-y-2">
                    <div className="h-4 rounded animate-pulse w-1/2" style={{ background: 'var(--bg-muted)' }} />
                    <div className="h-3 rounded animate-pulse w-full" style={{ background: 'var(--bg-muted)' }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div 
              className="rounded-lg p-8 text-center"
              style={{ background: 'var(--bg-alt)', border: '1px solid var(--border)' }}
            >
              <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="text-sm font-medium"
                style={{ color: 'var(--orange)' }}
              >
                Réessayer
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && ads.length === 0 && (
            <div 
              className="rounded-lg p-10 text-center"
              style={{ background: 'var(--bg-alt)', border: '1px solid var(--border)' }}
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ background: 'var(--bg-muted)' }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>Aucune annonce</p>
              <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
                {searchQuery ? 'Essayez une autre recherche' : 'Publiez la première !'}
              </p>
              <Link 
                href="/ads/new" 
                className="text-sm font-medium"
                style={{ color: 'var(--orange)' }}
              >
                Créer une annonce
              </Link>
            </div>
          )}

          {/* Grid */}
          {!loading && !error && ads.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {ads.map((ad) => (
                <AdCard key={ad.id} ad={ad} />
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center py-16">
      <div 
        className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
        style={{ borderColor: 'var(--orange)', borderTopColor: 'transparent' }}
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      <Navbar />
      
      <Suspense fallback={<LoadingFallback />}>
        <HomeContent />
      </Suspense>

      {/* Footer */}
      <footer 
        className="mt-auto py-5"
        style={{ background: 'var(--bg-alt)', borderTop: '1px solid var(--border)' }}
      >
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
            <span className="font-medium" style={{ color: 'var(--text)' }}>
              lemauvais<span style={{ color: 'var(--orange)' }}>coin</span>
            </span>
            <div className="flex gap-4" style={{ color: 'var(--text-secondary)' }}>
              <Link href="/">Accueil</Link>
              <Link href="/ads/new">Déposer</Link>
              <a href="#">Aide</a>
            </div>
            <span style={{ color: 'var(--text-muted)' }}>© 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
