'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { AdCard } from '@/components/ads/AdCard';
import { Ad, adsAPI } from '@/lib/api';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

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
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xl md:text-3xl font-semibold text-white mb-2"
          >
            le mauvais coin
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-white/70 text-sm mb-5"
          >
            Des prestations douteuses, mais bien notées
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link 
              href="/ads/new" 
              className="inline-block bg-white/90 hover:bg-white px-4 py-2 rounded text-sm font-medium transition-all hover:scale-105"
              style={{ color: 'var(--orange)' }}
            >
              Déposer une annonce
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: 'var(--bg-alt)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-5xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex items-center gap-2 py-3 overflow-x-auto"
          >
            {categories.map((cat, index) => (
              <motion.button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.value)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                className="px-3 py-1.5 rounded text-sm whitespace-nowrap transition-colors"
                style={{
                  background: selectedCategory === cat.value ? 'var(--orange)' : 'var(--bg-muted)',
                  color: selectedCategory === cat.value ? 'white' : 'var(--text-secondary)'
                }}
              >
                {cat.name}
              </motion.button>
            ))}
          </motion.div>
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
          <AnimatePresence>
            {!loading && !error && ads.length === 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="rounded-lg p-10 text-center"
                style={{ background: 'var(--bg-alt)', border: '1px solid var(--border)' }}
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                  style={{ background: 'var(--bg-muted)' }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </motion.div>
                <p className="text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>Aucune annonce</p>
                <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
                  {searchQuery ? 'Essayez une autre recherche' : 'Publiez la première !'}
                </p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    href="/ads/new" 
                    className="text-sm font-medium"
                    style={{ color: 'var(--orange)' }}
                  >
                    Créer une annonce
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Grid */}
          <AnimatePresence mode="wait">
            {!loading && !error && ads.length > 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
              >
                {ads.map((ad, index) => (
                  <motion.div
                    key={ad.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ y: -5 }}
                  >
                    <AdCard ad={ad} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

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

function Footer() {
  const pathname = usePathname();
  
  const footerLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/ads/new', label: 'Déposer' },
    { href: '/mentions-legales', label: 'Mentions légales' },
  ];

  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="mt-auto py-5"
      style={{ background: 'var(--bg-alt)', borderTop: '1px solid var(--border)' }}
    >
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
          <span className="font-medium" style={{ color: 'var(--text)' }}>
            le mauvais <span style={{ color: 'var(--orange)' }}>coin</span>
          </span>
          <div className="flex gap-4">
            {footerLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href}
                className="transition-colors hover:opacity-80"
                style={{ 
                  color: pathname === link.href ? 'var(--orange)' : 'var(--text-secondary)',
                  fontWeight: pathname === link.href ? 500 : 400
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <span style={{ color: 'var(--text-muted)' }}>© 2026</span>
        </div>
      </div>
    </motion.footer>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      <Navbar />
      
      <Suspense fallback={<LoadingFallback />}>
        <HomeContent />
      </Suspense>

      <Footer />
    </div>
  );
}
