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
      <div className="bg-orange-600">
        <div className="max-w-5xl mx-auto px-4 py-10 md:py-14">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-3">
            Petites annonces gratuites
          </h1>
          <p className="text-orange-100 mb-6">
            Achetez et vendez près de chez vous
          </p>
          <Link 
            href="/ads/new" 
            className="inline-block bg-white text-orange-600 px-5 py-2.5 rounded font-medium text-sm hover:bg-orange-50"
          >
            Déposer une annonce
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-1 py-3 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded text-sm whitespace-nowrap transition-colors ${
                  selectedCategory === cat.value
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="bg-gray-50 min-h-[60vh]">
        <div className="max-w-5xl mx-auto px-4 py-6">
          
          {/* Section header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {searchQuery ? `Résultats pour "${searchQuery}"` : 'Annonces récentes'}
              </h2>
              {!loading && (
                <p className="text-sm text-gray-500 mt-0.5">
                  {ads.length} annonce{ads.length !== 1 ? 's' : ''} trouvée{ads.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>
            {ads.length > 0 && !loading && (
              <select className="text-sm border border-gray-300 rounded px-3 py-1.5 bg-white text-gray-700">
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
                <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="aspect-square bg-gray-200 animate-pulse" />
                  <div className="p-3 space-y-2">
                    <div className="h-5 bg-gray-200 rounded animate-pulse w-1/2" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <p className="text-gray-500 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="text-orange-600 font-medium hover:underline"
              >
                Réessayer
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && ads.length === 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-gray-900 font-medium mb-1">Aucune annonce</h3>
              <p className="text-gray-500 text-sm mb-4">
                {searchQuery ? 'Modifiez votre recherche' : 'Soyez le premier à publier'}
              </p>
              <Link href="/ads/new" className="text-orange-600 font-medium hover:underline text-sm">
                Créer une annonce →
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
    <div className="flex items-center justify-center py-20">
      <div className="w-6 h-6 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <Suspense fallback={<LoadingFallback />}>
        <HomeContent />
      </Suspense>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-gray-200 py-6">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">lemauvais<span className="text-orange-600">coin</span></span>
            </div>
            <div className="flex gap-4">
              <Link href="/" className="hover:text-gray-900">Accueil</Link>
              <Link href="/ads/new" className="hover:text-gray-900">Déposer</Link>
              <a href="#" className="hover:text-gray-900">Aide</a>
            </div>
            <span className="text-xs text-gray-400">© 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
