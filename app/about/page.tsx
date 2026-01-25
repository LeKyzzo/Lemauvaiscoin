'use client';

import { Navbar } from '@/components/layout/Navbar';
import { motion } from 'framer-motion';
import { Heart, Shield, Zap, Users } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
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
              À propos de LeMauvaisCoin
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-white/90"
            >
              Des prestations douteuses, mais bien notées
            </motion.p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
          {/* Mission */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text)' }}>
              Notre Mission
            </h2>
            <p className="leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              LeMauvaisCoin est né d'une idée simple : créer une plateforme de marketplace moderne, 
              sécurisée et facile à utiliser. Nous croyons que chacun devrait pouvoir vendre ou 
              acheter des biens et services en toute simplicité.
            </p>
            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Notre plateforme utilise une architecture micro-services conteneurisée, garantissant 
              performance, scalabilité et fiabilité. Chaque transaction est sécurisée, chaque 
              utilisateur est protégé.
            </p>
          </motion.section>

          {/* Values */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text)' }}>
              Nos Valeurs
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: Shield,
                  title: 'Sécurité',
                  description: 'Vos données et transactions sont protégées avec les meilleures pratiques de sécurité.',
                },
                {
                  icon: Zap,
                  title: 'Performance',
                  description: 'Une plateforme rapide et réactive, optimisée pour une expérience utilisateur fluide.',
                },
                {
                  icon: Users,
                  title: 'Communauté',
                  description: 'Une communauté de confiance où chacun peut vendre et acheter en toute sérénité.',
                },
                {
                  icon: Heart,
                  title: 'Simplicité',
                  description: 'Une interface intuitive et moderne, pensée pour être accessible à tous.',
                },
              ].map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="card"
                >
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                    style={{ background: 'var(--orange-light)' }}
                  >
                    <value.icon className="w-6 h-6" style={{ color: 'var(--orange)' }} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>
                    {value.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Technology */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card"
          >
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text)' }}>
              Technologie
            </h2>
            <p className="leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              LeMauvaisCoin est construit avec les technologies les plus modernes :
            </p>
            <ul className="space-y-2 mb-6" style={{ color: 'var(--text-secondary)' }}>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                <span><strong>Frontend :</strong> Next.js 16, React 19, TypeScript, Tailwind CSS, Framer Motion</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                <span><strong>Backend :</strong> Node.js, Express.js, Architecture micro-services</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                <span><strong>Base de données :</strong> PostgreSQL 16</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                <span><strong>Infrastructure :</strong> Docker, Docker Compose, Nginx</span>
              </li>
            </ul>
            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Cette architecture garantit scalabilité, maintenabilité et performance optimales.
            </p>
          </motion.section>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="card text-center"
            style={{ background: 'var(--orange-light)' }}
          >
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text)' }}>
              Rejoignez-nous !
            </h2>
            <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
              Commencez à vendre ou acheter dès aujourd'hui
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/register" className="btn-orange">
                Créer un compte
              </Link>
              <Link href="/" className="btn-outline">
                Voir les annonces
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
