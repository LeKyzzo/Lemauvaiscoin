'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { AdCard } from '@/components/ads/AdCard';
import { Ad, adsAPI } from '@/lib/api';
import { getFavorites } from '@/lib/favorites';
import { motion } from 'framer-motion';
import { Heart, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function FavoritesPage() {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const ids = getFavorites();
        setFavoriteIds(ids);
        
        if (ids.length === 0) {
          setLoading(false);
          return;
        }

        // Load all favorite ads
        const allAds = await Promise.all(
          ids.map(async (id) => {
            try {
              return await adsAPI.getById(id);
            } catch {
              return null;
            }
          })
        );

        setAds(allAds.filter((ad): ad is Ad => ad !== null));
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--orange)' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      <Navbar />
      
      <main className="flex-1">
        {/* Hero */}
        <div style={{ background: 'var(--orange)' }} className="py-12">
          <div className="max-w-5xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex justify-center mb-4"
            >
              <Heart className="w-12 h-12 text-white fill-white" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-white text-center mb-2"
            >
              Mes Favoris
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/90 text-center"
            >
              {ads.length} annonce{ads.length !== 1 ? 's' : ''} sauvegardée{ads.length !== 1 ? 's' : ''}
            </motion.p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-4 py-8">
          {ads.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-12 text-center"
            >
              <Heart className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
              <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text)' }}>
                Aucun favori pour le moment
              </h2>
              <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
                Ajoutez des annonces à vos favoris pour les retrouver facilement
              </p>
              <Link href="/" className="btn-orange inline-flex items-center gap-2">
                Parcourir les annonces
              </Link>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
            >
              {ads.map((ad, index) => (
                <motion.div
                  key={ad.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <AdCard ad={ad} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
