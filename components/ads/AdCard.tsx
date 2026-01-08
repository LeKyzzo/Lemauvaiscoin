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
    if (hours < 24) return `Il y a ${hours}h`;
    if (days === 1) return "Hier";
    if (days < 7) return `Il y a ${days} jours`;
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <Link href={`/ads/${ad.id}`} className="block group">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
        {/* Image */}
        <div className="relative bg-gray-100 aspect-square">
          {ad.imageUrl && !imageError ? (
            <img
              src={ad.imageUrl}
              alt=""
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          <p className="text-orange-600 font-bold text-lg mb-1">
            {formatPrice(ad.price)}
          </p>
          <h3 className="text-gray-900 text-sm font-normal leading-tight line-clamp-2 mb-2 group-hover:text-orange-600">
            {ad.title}
          </h3>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="truncate max-w-[60%]">{ad.location || 'France'}</span>
            <span>{formatDate(ad.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
