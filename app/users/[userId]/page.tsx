'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { Navbar } from '@/components/layout/Navbar';
import { messagesAPI } from '@/lib/api';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Mail, Phone, MessageCircle } from 'lucide-react';
import { useToast } from '@/components/providers/ToastProvider';
import Link from 'next/link';

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user: currentUser } = useAuth();
  const toast = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    // Pour l'instant, on récupère juste l'ID depuis les params
    // Dans un vrai système, on aurait une route API pour récupérer les infos utilisateur
    setLoading(false);
  }, [params.userId, isAuthenticated]);

  const handleStartConversation = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    router.push(`/messages/${params.userId}`);
  };

  if (!isAuthenticated) return null;

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
        <div className="max-w-4xl mx-auto px-4 py-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 mb-6 text-sm"
            style={{ color: 'var(--text-secondary)' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>

          <div className="card p-8 text-center">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white mx-auto mb-6"
              style={{ background: 'var(--orange)' }}
            >
              U
            </div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>
              Utilisateur #{params.userId}
            </h1>
            <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
              Profil utilisateur
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleStartConversation}
                className="btn-orange flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Envoyer un message
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
