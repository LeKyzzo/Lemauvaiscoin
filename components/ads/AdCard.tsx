'use client';

import Link from 'next/link';
import { Ad } from '@/lib/api';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { isFavorite, toggleFavorite } from '@/lib/favorites';
import { useToast } from '@/components/providers/ToastProvider';

interface AdCardProps {
  ad: Ad;
}

export function AdCard({ ad }: AdCardProps) {
  const [imageError, setImageError] = useState(false);
  const [favorite, setFavorite] = useState(isFavorite(ad.id));
  const toast = useToast();

  const formatPrice = (price: number) => {
    if (price === 0) return 'Gratuit';
    return price.toLocaleString('fr-FR') + ' €';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (hours < 1) return "À l'instant";
    if (hours < 24) return `${hours}h`;
    if (days === 1) return "Hier";
    if (days < 7) return `${days}j`;
    return date.toLocaleDateString('fr-FR');
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newFavorite = toggleFavorite(ad.id);
    setFavorite(newFavorite);
    toast.success(newFavorite ? 'Ajouté aux favoris' : 'Retiré des favoris');
  };

  return (
    <div className="relative group">
      <Link href={`/ads/${ad.id}`} className="block">
        <motion.div 
          className="rounded-lg overflow-hidden transition-all duration-200"
          style={{ background: 'var(--bg-alt)', border: '1px solid var(--border)' }}
          whileHover={{ y: -4, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
        >
          {/* Image */}
          <div className="aspect-square relative" style={{ background: 'var(--bg-muted)' }}>
            {ad.imageUrl && !imageError ? (
              <img
                src={ad.imageUrl}
                alt={ad.title}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ color: 'var(--text-muted)' }}>
                <svg className="w-10 h-10 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
            )}
            
            {/* Favorite Button */}
            <button
              onClick={handleFavoriteClick}
              className="absolute top-2 right-2 p-2 rounded-full backdrop-blur-sm transition-all"
              style={{
                background: favorite ? 'rgba(234, 88, 12, 0.9)' : 'rgba(0, 0, 0, 0.3)',
                color: favorite ? 'white' : 'white'
              }}
            >
              <Heart className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Content */}
          <div className="p-2.5">
            <p className="font-semibold text-sm mb-0.5" style={{ color: 'var(--orange)' }}>
              {formatPrice(ad.price)}
            </p>
            <h3 
              className="text-xs leading-tight line-clamp-2 mb-1.5 font-medium"
              style={{ color: 'var(--text)' }}
            >
              {ad.title}
            </h3>
            <div className="flex items-center justify-between text-[10px]" style={{ color: 'var(--text-muted)' }}>
              <span className="truncate max-w-[65%]">{ad.location || 'France'}</span>
              <span>{formatDate(ad.createdAt)}</span>
            </div>
          </div>
        </motion.div>
      </Link>
    </div>
  );
}
