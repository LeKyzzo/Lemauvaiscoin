'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { AlertTriangle, Scale, ShieldOff, FileX, UserX, MapPinOff } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MentionsLegalesPage() {
  const pathname = usePathname();
  
  const footerLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/ads/new', label: 'Déposer' },
    { href: '/mentions-legales', label: 'Mentions légales' },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      <Navbar />
      
      <main className="flex-1">
        {/* Header */}
        <div style={{ background: 'var(--orange)' }}>
          <div className="max-w-3xl mx-auto px-4 py-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-3"
            >
              <AlertTriangle className="w-8 h-8 text-white" />
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Mentions légales
              </h1>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-white/80 text-sm"
            >
              Des prestations douteuses, mais bien notées - © 2026
            </motion.p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 py-8">
          
          {/* Disclaimer */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-lg p-6 mb-8"
            style={{ background: 'var(--orange-light)', border: '1px solid var(--orange)' }}
          >
            <p className="text-sm font-medium" style={{ color: 'var(--orange)' }}>
              ⚠️ AVERTISSEMENT : Cette page est entièrement fictive et à but humoristique. 
              Aucune activité illégale n'est encouragée ou facilitée par ce site.
            </p>
          </motion.div>

          {/* Section 1 */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <FileX className="w-5 h-5" style={{ color: 'var(--orange)' }} />
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>
                Article 1 - Éditeur du site
              </h2>
            </div>
            <div 
              className="rounded-lg p-5"
              style={{ background: 'var(--bg-alt)', border: '1px solid var(--border)' }}
            >
              <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--text)' }}>Raison sociale :</strong> Aucune (t'as capté pas trop de traces hein)
              </p>
              <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--text)' }}>Forme juridique :</strong> Association de malfaiteurs
              </p>
              <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--text)' }}>Capital social :</strong> ça ça dépend si le Louvre remet la sécurité ou pas
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--text)' }}>SIRET :</strong> T'en fait pas poto
              </p>
            </div>
          </motion.section>

          {/* Section 2 */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <MapPinOff className="w-5 h-5" style={{ color: 'var(--orange)' }} />
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>
                Article 2 - Siège social
              </h2>
            </div>
            <div 
              className="rounded-lg p-5"
              style={{ background: 'var(--bg-alt)', border: '1px solid var(--border)' }}
            >
              <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--text)' }}>Adresse :</strong> Aubervilliers, 93300, là où ça vend du shit et où ça pue
              </p>
              <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--text)' }}>Téléphone :</strong> Ajoute sur snap c'est Vendeur2ZipetteEnDirecte
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--text)' }}>Email :</strong> contact@tktpaspournous.fr
              </p>
            </div>
          </motion.section>

          {/* Section 3 */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <UserX className="w-5 h-5" style={{ color: 'var(--orange)' }} />
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>
                Article 3 - Directeur de la publication
              </h2>
            </div>
            <div 
              className="rounded-lg p-5"
              style={{ background: 'var(--bg-alt)', border: '1px solid var(--border)' }}
            >
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--text)' }}>Nom :</strong> Nasser "Nasdas" Kassou
                <br />
              </p>
            </div>
          </motion.section>

          {/* Section 4 */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <ShieldOff className="w-5 h-5" style={{ color: 'var(--orange)' }} />
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>
                Article 4 - Hébergeur
              </h2>
            </div>
            <div 
              className="rounded-lg p-5"
              style={{ background: 'var(--bg-alt)', border: '1px solid var(--border)' }}
            >
              <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--text)' }}>Société :</strong> Un serveur dans une cave, quelque part
              </p>
              <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--text)' }}>Localisation :</strong> Délocalisé toutes les 48h (par précaution, c'est du speed)
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--text)' }}>Uptime :</strong> Dépend des shmidts
              </p>
            </div>
          </motion.section>

          {/* Section 5 */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <Scale className="w-5 h-5" style={{ color: 'var(--orange)' }} />
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>
                Article 5 - Responsabilité
              </h2>
            </div>
            <div 
              className="rounded-lg p-5"
              style={{ background: 'var(--bg-alt)', border: '1px solid var(--border)' }}
            >
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                Le site <strong style={{ color: 'var(--text)' }}>le mauvais coin</strong> décline toute responsabilité concernant :
              </p>
              <ul className="text-sm space-y-2" style={{ color: 'var(--text-secondary)' }}>
                <li className="flex items-start gap-2">
                  <span style={{ color: 'var(--orange)' }}>•</span>
                  L'origine des produits vendus
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: 'var(--orange)' }}>•</span>
                  Les éventuelles visites policières à votre domicile
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: 'var(--orange)' }}>•</span>
                  Les disputes entre acheteurs et vendeurs (réglez ça entre vous)
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: 'var(--orange)' }}>•</span>
                  La qualité des objets (c'est du recel, pas du neuf)
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: 'var(--orange)' }}>•</span>
                  Votre casier judiciaire (il était déjà bien rempli avant nous)
                </li>
              </ul>
            </div>
          </motion.section>

          {/* Section 6 */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-5 h-5" style={{ color: 'var(--orange)' }} />
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>
                Article 6 - Protection des données
              </h2>
            </div>
            <div 
              className="rounded-lg p-5"
              style={{ background: 'var(--bg-alt)', border: '1px solid var(--border)' }}
            >
              <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                Conformément à la loi "            " du 32 décembre 2077 "hehe cyberpunk" :
              </p>
              <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                Vos données personnelles sont stockées... enfin on croit. On n'a pas vraiment de DPO, 
                ni de registre de traitement, ni de politique de confidentialité. 
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--text)' }}>RGPD ?</strong> C'est quoi ça ? Modèle de la nouvelle M5 ?
              </p>
            </div>
          </motion.section>

          {/* Section 7 - Cookies */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xl">🍪</span>
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>
                Article 7 - Cookies
              </h2>
            </div>
            <div 
              className="rounded-lg p-5"
              style={{ background: 'var(--bg-alt)', border: '1px solid var(--border)' }}
            >
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Un jour un grand homme à dit "The best part about stealing people's data is that they don't even know what it means"
              </p>
            </div>
          </motion.section>

          {/* Final note */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1, type: "spring" }}
            className="rounded-lg p-6 text-center"
            style={{ background: 'var(--bg-muted)' }}
          >
            <p className="text-sm italic" style={{ color: 'var(--text-secondary)' }}>
              "La seule chose légale sur ce site, c'est cette page. Et encore, on n'est pas sûrs."
            </p>
            <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
              — Jean-Michel Introuvable, PDG de Le Mauvais Coin
            </p>
          </motion.div>

        </div>
      </main>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="py-5"
        style={{ background: 'var(--bg-alt)', borderTop: '1px solid var(--border)' }}
      >
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
            <span className="font-medium" style={{ color: 'var(--text)' }}>
              le mauvais <span style={{ color: 'var(--orange)' }}>coin</span>
            </span>
            <div className="flex gap-4">
              {footerLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href}
                  className="transition-colors hover:opacity-80"
                  style={{ 
                    color: pathname === link.href ? 'var(--orange)' : 'var(--text-secondary)',
                    fontWeight: pathname === link.href ? 500 : 400
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <span style={{ color: 'var(--text-muted)' }}>© 2026</span>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
