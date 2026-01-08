'use client';

import Link from 'next/link';
import { Ad } from '@/lib/api';
import { useState } from 'react';

interface AdCardProps {
  ad: Ad;
}

export function AdCard({ ad }: AdCardProps) {
  const [imageError, setImageError] = useState(false);

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

  return (
    <Link href={`/ads/${ad.id}`} className="block group">
      <div 
        className="rounded-lg overflow-hidden transition-shadow hover:shadow-md"
        style={{ background: 'var(--bg-alt)', border: '1px solid var(--border)' }}
      >
        {/* Image */}
        <div className="aspect-square" style={{ background: 'var(--bg-muted)' }}>
          {ad.imageUrl && !imageError ? (
            <img
              src={ad.imageUrl}
              alt=""
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
        </div>

        {/* Content */}
        <div className="p-2.5">
          <p className="font-semibold text-sm mb-0.5" style={{ color: 'var(--orange)' }}>
            {formatPrice(ad.price)}
          </p>
          <h3 
            className="text-xs leading-tight line-clamp-2 mb-1.5"
            style={{ color: 'var(--text)' }}
          >
            {ad.title}
          </h3>
          <div className="flex items-center justify-between text-[10px]" style={{ color: 'var(--text-muted)' }}>
            <span className="truncate max-w-[65%]">{ad.location || 'France'}</span>
            <span>{formatDate(ad.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
