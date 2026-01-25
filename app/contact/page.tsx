'use client';

import { Navbar } from '@/components/layout/Navbar';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/components/providers/ToastProvider';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [sending, setSending] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    // Simulate sending (in production, this would call an API)
    setTimeout(() => {
      toast.success('Message envoyé ! Nous vous répondrons dans les plus brefs délais.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSending(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      <Navbar />
      
      <main className="flex-1">
        {/* Hero */}
        <div style={{ background: 'var(--orange)' }} className="py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              Contactez-nous
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-white/90"
            >
              Nous sommes là pour vous aider
            </motion.p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text)' }}>
                  Informations de contact
                </h2>
                <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
                  N'hésitez pas à nous contacter pour toute question, suggestion ou problème. 
                  Notre équipe vous répondra dans les plus brefs délais.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: 'var(--orange-light)' }}
                  >
                    <Mail className="w-6 h-6" style={{ color: 'var(--orange)' }} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1" style={{ color: 'var(--text)' }}>Email</h3>
                    <a
                      href="mailto:contact@lemauvaiscoin.fr"
                      className="text-sm"
                      style={{ color: 'var(--orange)' }}
                    >
                      contact@lemauvaiscoin.fr
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: 'var(--orange-light)' }}
                  >
                    <Phone className="w-6 h-6" style={{ color: 'var(--orange)' }} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1" style={{ color: 'var(--text)' }}>Téléphone</h3>
                    <a
                      href="tel:+33123456789"
                      className="text-sm"
                      style={{ color: 'var(--orange)' }}
                    >
                      +33 1 23 45 67 89
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: 'var(--orange-light)' }}
                  >
                    <MapPin className="w-6 h-6" style={{ color: 'var(--orange)' }} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1" style={{ color: 'var(--text)' }}>Adresse</h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      123 Rue de la Marketplace<br />
                      75001 Paris, France
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card"
            >
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text)' }}>
                Envoyez-nous un message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
                    Nom complet
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border"
                    style={{
                      background: 'var(--bg)',
                      borderColor: 'var(--border)',
                      color: 'var(--text)',
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border"
                    style={{
                      background: 'var(--bg)',
                      borderColor: 'var(--border)',
                      color: 'var(--text)',
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
                    Sujet
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border"
                    style={{
                      background: 'var(--bg)',
                      borderColor: 'var(--border)',
                      color: 'var(--text)',
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border resize-none"
                    style={{
                      background: 'var(--bg)',
                      borderColor: 'var(--border)',
                      color: 'var(--text)',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="btn-orange w-full flex items-center justify-center gap-2"
                >
                  {sending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Envoyer le message
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
