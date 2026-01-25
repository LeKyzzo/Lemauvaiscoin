'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { Navbar } from '@/components/layout/Navbar';
import { messagesAPI, Conversation } from '@/lib/api';
import { motion } from 'framer-motion';
import { MessageCircle, Loader2, Search, Send } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/providers/ToastProvider';

export default function MessagesPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    } else if (isAuthenticated) {
      loadConversations();
    }
  }, [isAuthenticated, authLoading]);

  const loadConversations = async () => {
    try {
      const data = await messagesAPI.getConversations();
      setConversations(data.conversations || []);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des conversations');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (hours < 1) return "À l'instant";
    if (hours < 24) return `${hours}h`;
    if (days === 1) return "Hier";
    if (days < 7) return `${days}j`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      conv.firstName?.toLowerCase().includes(search) ||
      conv.lastName?.toLowerCase().includes(search) ||
      conv.email.toLowerCase().includes(search)
    );
  });

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--orange)' }} />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

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
              <MessageCircle className="w-12 h-12 text-white fill-white" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-white text-center mb-2"
            >
              Mes Messages
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/90 text-center"
            >
              {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
            </motion.p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une conversation..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border text-sm"
                style={{
                  background: 'var(--bg-alt)',
                  borderColor: 'var(--border)',
                  color: 'var(--text)'
                }}
              />
            </div>
          </div>

          {/* Conversations List */}
          {filteredConversations.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-12 text-center"
            >
              <MessageCircle className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
              <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text)' }}>
                {searchQuery ? 'Aucune conversation trouvée' : 'Aucune conversation'}
              </h2>
              <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
                {searchQuery 
                  ? 'Essayez une autre recherche' 
                  : 'Commencez une conversation avec un autre utilisateur'}
              </p>
              {!searchQuery && (
                <Link href="/" className="btn-orange inline-flex items-center gap-2">
                  Parcourir les annonces
                </Link>
              )}
            </motion.div>
          ) : (
            <div className="space-y-2">
              {filteredConversations.map((conv, index) => (
                <motion.div
                  key={conv.userId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/messages/${conv.userId}`}>
                    <div className="card p-4 hover:shadow-md transition-all group">
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white shrink-0"
                          style={{ background: 'var(--orange)' }}
                        >
                          {conv.firstName?.[0] || conv.email[0].toUpperCase()}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold truncate" style={{ color: 'var(--text)' }}>
                              {conv.firstName && conv.lastName
                                ? `${conv.firstName} ${conv.lastName}`
                                : conv.email}
                            </h3>
                            {conv.unreadCount > 0 && (
                              <span
                                className="px-2 py-0.5 rounded-full text-xs font-bold text-white shrink-0"
                                style={{ background: 'var(--orange)' }}
                              >
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                          {conv.lastMessage && (
                            <p className="text-sm truncate mb-1" style={{ color: 'var(--text-secondary)' }}>
                              {conv.lastMessage}
                            </p>
                          )}
                          {conv.lastMessageDate && (
                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                              {formatDate(conv.lastMessageDate)}
                            </p>
                          )}
                        </div>

                        {/* Arrow */}
                        <Send className="w-4 h-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--text-muted)' }} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
