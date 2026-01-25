'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Ad, adsAPI } from '@/lib/api';
import { useAuth } from '@/components/providers/AuthProvider';
import { ArrowLeft, Loader2, MapPin, Clock, Mail, Phone, Trash2, AlertCircle, Heart, Share2, Flag, MessageCircle } from 'lucide-react';
import { isFavorite, toggleFavorite } from '@/lib/favorites';
import { useToast } from '@/components/providers/ToastProvider';
import Link from 'next/link';

export default function AdDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorite, setFavorite] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (params.id) {
      loadAd();
      setFavorite(isFavorite(Number(params.id)));
    }
  }, [params.id]);

  const loadAd = async () => {
    try {
      const data = await adsAPI.getById(params.id as string);
      setAd(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!ad || !confirm('Supprimer cette annonce ?')) return;
    try {
      await adsAPI.delete(ad.id.toString());
      router.push('/');
    } catch (error) {
      alert('Erreur');
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Gratuit';
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--orange)' }} />
      </div>
    );
  }

  if (!ad) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4" style={{ background: 'var(--bg-secondary)' }}>
        <span className="text-5xl">🔍</span>
        <p className="font-medium" style={{ color: 'var(--text)' }}>Annonce introuvable</p>
        <Link href="/" className="btn-orange">Retour à l'accueil</Link>
      </div>
    );
  }

  const isOwner = isAuthenticated && user?.id === ad.userId;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
      {/* Breadcrumb */}
      <div className="border-b" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto px-4 py-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm hover:opacity-70"
            style={{ color: 'var(--text-secondary)' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux résultats
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <div className="card overflow-hidden">
              <div className="aspect-video" style={{ background: 'var(--bg-tertiary)' }}>
                {ad.imageUrl ? (
                  <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-6xl opacity-30">📦</span>
                  </div>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="card p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  {ad.category && (
                    <span 
                      className="tag mb-2"
                      style={{ background: 'var(--orange-light)', color: 'var(--orange)' }}
                    >
                      {ad.category}
                    </span>
                  )}
                  <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{ad.title}</h1>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      const newFavorite = toggleFavorite(ad.id);
                      setFavorite(newFavorite);
                      toast.success(newFavorite ? 'Ajouté aux favoris' : 'Retiré des favoris');
                    }}
                    className="p-2 rounded-lg hover:opacity-70 transition-all"
                    style={{ 
                      background: favorite ? 'var(--orange-light)' : 'var(--bg-tertiary)', 
                      color: favorite ? 'var(--orange)' : 'var(--text-secondary)' 
                    }}
                  >
                    <Heart className={`w-5 h-5 ${favorite ? 'fill-current' : ''}`} />
                  </button>
                  <button 
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: ad.title,
                          text: ad.description,
                          url: window.location.href,
                        });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success('Lien copié dans le presse-papier');
                      }
                    }}
                    className="p-2 rounded-lg hover:opacity-70 transition-all"
                    style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <p className="text-3xl font-bold mb-6" style={{ color: 'var(--orange)' }}>
                {formatPrice(ad.price)}
              </p>

              <div className="flex flex-wrap gap-4 pb-6 mb-6 border-b" style={{ borderColor: 'var(--border)' }}>
                {ad.location && (
                  <span className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <MapPin className="w-4 h-4" />
                    {ad.location}
                  </span>
                )}
                <span className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <Clock className="w-4 h-4" />
                  Publié le {formatDate(ad.createdAt)}
                </span>
              </div>

              <h2 className="font-bold mb-3" style={{ color: 'var(--text)' }}>Description</h2>
              <p className="whitespace-pre-wrap leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {ad.description || "Pas de description fournie... c'est encore plus douteux !"}
              </p>
            </div>

            {/* Warning */}
            <div className="card p-4 flex items-start gap-3" style={{ background: '#fff7ed', border: '1px solid #fed7aa' }}>
              <AlertCircle className="w-5 h-5 shrink-0" style={{ color: 'var(--orange)' }} />
              <div className="text-sm" style={{ color: '#9a3412' }}>
                <p className="font-medium">Rappel de sécurité</p>
                <p>Méfiez-vous des prestations trop belles pour être vraies. Ne payez jamais avant d'avoir vérifié.</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-4">
              <h2 className="font-bold mb-4" style={{ color: 'var(--text)' }}>Vendeur</h2>
              
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white"
                  style={{ background: 'var(--orange)' }}
                >
                  {ad.user?.firstName?.[0] || ad.user?.email?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <p className="font-semibold" style={{ color: 'var(--text)' }}>
                    {ad.user?.firstName && ad.user?.lastName 
                      ? `${ad.user.firstName} ${ad.user.lastName}`
                      : 'Utilisateur'}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Membre lemauvais coin
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {isAuthenticated && ad.userId !== user?.id && (
                  <Link
                    href={`/messages/${ad.userId}`}
                    className="btn-orange w-full flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Envoyer un message
                  </Link>
                )}
                {ad.user?.email && (
                  <a
                    href={`mailto:${ad.user.email}?subject=À propos de : ${ad.title}`}
                    className="btn-outline w-full flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Envoyer un email
                  </a>
                )}
                {ad.user?.phone && (
                  <a
                    href={`tel:${ad.user.phone}`}
                    className="btn-outline w-full flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    {ad.user.phone}
                  </a>
                )}
              </div>

              {isOwner && (
                <div className="pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                  <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
                    C'est votre annonce
                  </p>
                  <button
                    onClick={handleDelete}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm"
                    style={{ background: '#fee2e2', color: '#dc2626' }}
                  >
                    <Trash2 className="w-4 h-4" />
                    Supprimer
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
