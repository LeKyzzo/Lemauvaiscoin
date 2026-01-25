'use client';

import { Navbar } from '@/components/layout/Navbar';
import { motion } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'Comment créer une annonce ?',
    answer: 'Pour créer une annonce, vous devez d\'abord vous inscrire ou vous connecter. Ensuite, cliquez sur le bouton "Déposer une annonce" dans la barre de navigation. Remplissez le formulaire avec les informations de votre prestation (titre, description, prix, catégorie, localisation) et ajoutez une image si vous le souhaitez. Une fois publiée, votre annonce sera visible par tous les utilisateurs.',
  },
  {
    question: 'Comment contacter un vendeur ?',
    answer: 'Sur la page de détail d\'une annonce, vous trouverez les informations de contact du vendeur (email et téléphone si renseigné). Vous pouvez cliquer directement sur ces informations pour envoyer un email ou appeler le vendeur.',
  },
  {
    question: 'Puis-je modifier ou supprimer mon annonce ?',
    answer: 'Oui, vous pouvez modifier ou supprimer vos propres annonces. Sur la page de détail de votre annonce, vous verrez un bouton "Modifier" ou "Supprimer". Seul le propriétaire de l\'annonce peut effectuer ces actions.',
  },
  {
    question: 'LeMauvaisCoin est-il gratuit ?',
    answer: 'Oui, l\'inscription et la publication d\'annonces sont entièrement gratuites. Nous ne facturons aucune commission sur les transactions.',
  },
  {
    question: 'Comment fonctionne la recherche ?',
    answer: 'Vous pouvez rechercher des annonces en utilisant la barre de recherche dans la navigation. Vous pouvez filtrer par catégorie, et bientôt par prix et localisation. La recherche s\'effectue sur les titres et descriptions des annonces.',
  },
  {
    question: 'Mes données sont-elles sécurisées ?',
    answer: 'Absolument. Nous utilisons des technologies de sécurité modernes : mots de passe hachés avec bcrypt, authentification JWT, validation et sanitization des données. Votre sécurité et votre vie privée sont nos priorités.',
  },
  {
    question: 'Puis-je signaler une annonce ?',
    answer: 'Si vous rencontrez une annonce suspecte ou inappropriée, vous pouvez nous contacter via la page Contact. Nous examinerons rapidement votre signalement.',
  },
  {
    question: 'Comment supprimer mon compte ?',
    answer: 'Pour supprimer votre compte, contactez-nous via la page Contact avec votre demande. Nous traiterons votre demande dans les plus brefs délais.',
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      <Navbar />
      
      <main className="flex-1">
        {/* Hero */}
        <div style={{ background: 'var(--orange)' }} className="py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex justify-center mb-4"
            >
              <HelpCircle className="w-16 h-16 text-white" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              Questions Fréquentes
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-white/90"
            >
              Trouvez les réponses à vos questions
            </motion.p>
          </div>
        </div>

        {/* FAQ List */}
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between gap-4 text-left"
                >
                  <h3 className="font-semibold flex-1" style={{ color: 'var(--text)' }}>
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 transition-transform ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    style={{ color: 'var(--text-secondary)' }}
                  />
                </button>
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="card text-center mt-12"
            style={{ background: 'var(--orange-light)' }}
          >
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text)' }}>
              Vous avez d'autres questions ?
            </h3>
            <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
              N'hésitez pas à nous contacter
            </p>
            <a href="/contact" className="btn-orange">
              Nous contacter
            </a>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
