'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { Navbar } from '@/components/layout/Navbar';
import { messagesAPI, Message, ConversationDetail } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Loader2, Send, User } from 'lucide-react';
import { useToast } from '@/components/providers/ToastProvider';

export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const toast = useToast();
  const [conversation, setConversation] = useState<ConversationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (params.userId) {
      loadConversation();
      // Polling pour les nouveaux messages
      const interval = setInterval(() => {
        loadConversation(false);
      }, 3000); // Vérifier toutes les 3 secondes
      setPollingInterval(interval);
    }

    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [params.userId, isAuthenticated]);

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversation = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const data = await messagesAPI.getConversation(Number(params.userId));
      setConversation(data);
    } catch (error: any) {
      console.error('Erreur:', error);
      if (showLoading) {
        toast.error(error?.response?.data?.error || 'Erreur lors du chargement de la conversation');
      }
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || sending) return;

    setSending(true);
    try {
      await messagesAPI.send(Number(params.userId), message);
      setMessage('');
      await loadConversation(false);
      scrollToBottom();
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Erreur lors de l\'envoi du message');
    } finally {
      setSending(false);
    }
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
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
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

  if (!conversation) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="mb-4" style={{ color: 'var(--text)' }}>Conversation introuvable</p>
            <button onClick={() => router.push('/messages')} className="btn-orange">
              Retour aux messages
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      <Navbar />
      
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <div style={{ background: 'var(--bg-alt)', borderBottom: '1px solid var(--border)' }}>
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/messages')}
                className="p-2 rounded-lg hover:opacity-70 transition-opacity"
                style={{ color: 'var(--text-secondary)' }}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0"
                style={{ background: 'var(--orange)' }}
              >
                {conversation.user.firstName?.[0] || conversation.user.email[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="font-semibold" style={{ color: 'var(--text)' }}>
                  {conversation.user.firstName && conversation.user.lastName
                    ? `${conversation.user.firstName} ${conversation.user.lastName}`
                    : conversation.user.email}
                </h1>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {conversation.user.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-6">
            {conversation.messages.length === 0 ? (
              <div className="text-center py-12">
                <User className="w-16 h-16 mx-auto mb-4 opacity-30" style={{ color: 'var(--text-muted)' }} />
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Aucun message. Commencez la conversation !
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {conversation.messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`flex ${msg.isFromCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-2 ${
                          msg.isFromCurrentUser
                            ? 'rounded-br-sm'
                            : 'rounded-bl-sm'
                        }`}
                        style={{
                          background: msg.isFromCurrentUser
                            ? 'var(--orange)'
                            : 'var(--bg-alt)',
                          color: msg.isFromCurrentUser
                            ? 'white'
                            : 'var(--text)',
                        }}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            msg.isFromCurrentUser ? 'text-white/70' : 'text-muted'
                          }`}
                        >
                          {formatDate(msg.createdAt)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input */}
        <div style={{ background: 'var(--bg-alt)', borderTop: '1px solid var(--border)' }}>
          <div className="max-w-4xl mx-auto px-4 py-4">
            <form onSubmit={handleSend} className="flex items-end gap-3">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
                placeholder="Tapez votre message..."
                rows={1}
                className="flex-1 px-4 py-3 rounded-lg border resize-none max-h-32"
                style={{
                  background: 'var(--bg)',
                  borderColor: 'var(--border)',
                  color: 'var(--text)'
                }}
              />
              <button
                type="submit"
                disabled={!message.trim() || sending}
                className="p-3 rounded-lg text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'var(--orange)' }}
              >
                {sending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
