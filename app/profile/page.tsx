'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { Ad, adsAPI } from '@/lib/api';
import { Loader2, Plus, Settings, Mail, Phone, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [userAds, setUserAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    } else if (isAuthenticated && user) {
      loadUserAds();
    }
  }, [isAuthenticated, user, authLoading]);

  const loadUserAds = async () => {
    if (!user) return;
    try {
      const data = await adsAPI.getByUser(user.id);
      setUserAds(data.ads || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Gratuit';
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(price);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--orange)' }} />
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-4">
              {/* Avatar */}
              <div className="flex flex-col items-center text-center mb-6">
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-4"
                  style={{ background: 'var(--orange)' }}
                >
                  {user.firstName?.[0] || user.email[0].toUpperCase()}
                </div>
                <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>
                  {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 'Utilisateur'}
                </h1>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Membre lemauvais coin
                </p>
              </div>

              {/* Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <Phone className="w-4 h-4" />
                    <span>{user.phone}</span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-4 rounded-xl text-center" style={{ background: 'var(--bg-tertiary)' }}>
                  <div className="text-2xl font-bold" style={{ color: 'var(--orange)' }}>{userAds.length}</div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Annonces</div>
                </div>
                <div className="p-4 rounded-xl text-center" style={{ background: 'var(--bg-tertiary)' }}>
                  <div className="text-2xl font-bold" style={{ color: 'var(--orange)' }}>0</div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Favoris</div>
                </div>
              </div>

              <button
                onClick={() => { logout(); router.push('/'); }}
                className="btn-outline w-full"
              >
                Déconnexion
              </button>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>
                Mes annonces
              </h2>
              <Link href="/ads/new" className="btn-orange flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Déposer
              </Link>
            </div>

            {userAds.length === 0 ? (
              <div className="card p-12 text-center">
                <span className="text-5xl block mb-4">📦</span>
                <p className="font-medium mb-2" style={{ color: 'var(--text)' }}>
                  Vous n'avez pas encore d'annonces
                </p>
                <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                  Déposez votre première prestation douteuse !
                </p>
                <Link href="/ads/new" className="btn-orange inline-flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Déposer une annonce
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {userAds.map((ad) => (
                  <Link key={ad.id} href={`/ads/${ad.id}`}>
                    <article className="card flex gap-4 p-4 hover:shadow-md transition-shadow">
                      <div className="w-32 h-24 shrink-0 rounded-lg overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
                        {ad.imageUrl ? (
                          <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-1 line-clamp-1" style={{ color: 'var(--text)' }}>
                          {ad.title}
                        </h3>
                        <p className="text-lg font-bold mb-2" style={{ color: 'var(--orange)' }}>
                          {formatPrice(ad.price)}
                        </p>
                        <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
                          {ad.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {ad.location}
                            </span>
                          )}
                          <span 
                            className="tag"
                            style={{ background: ad.status === 'active' ? '#dcfce7' : 'var(--bg-tertiary)', color: ad.status === 'active' ? '#16a34a' : 'var(--text-secondary)' }}
                          >
                            {ad.status === 'active' ? 'En ligne' : ad.status}
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
