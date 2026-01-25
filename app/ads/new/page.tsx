'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { AdCreate, adsAPI } from '@/lib/api';
import { ArrowLeft, Loader2, ImagePlus, Info } from 'lucide-react';
import { useToast } from '@/components/providers/ToastProvider';
import Link from 'next/link';

const categories = ['Services', 'Objets', 'Véhicules', 'Immobilier', 'Autre'];

export default function NewAdPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<AdCreate>({
    title: '',
    description: '',
    price: 0,
    category: '',
    location: '',
    imageUrl: '',
  });

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'price' ? parseFloat(value) || 0 : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adsAPI.create(formData);
      toast.success('Annonce publiée avec succès !');
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Erreur lors de la création de l\'annonce');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
      {/* Header */}
      <div className="border-b" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg hover:opacity-70"
              style={{ color: 'var(--text)' }}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>
              Déposer une annonce
            </h1>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="border-b" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                  style={{ 
                    background: step >= s ? 'var(--orange)' : 'var(--bg-tertiary)',
                    color: step >= s ? 'white' : 'var(--text-secondary)'
                  }}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div 
                    className="w-16 h-1 rounded"
                    style={{ background: step > s ? 'var(--orange)' : 'var(--bg-tertiary)' }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="card p-6">
              <h2 className="text-lg font-bold mb-6" style={{ color: 'var(--text)' }}>
                Catégorie et titre
              </h2>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text)' }}>
                  Catégorie *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat })}
                      className="p-4 rounded-xl text-center font-medium transition-all"
                      style={{
                        background: formData.category === cat ? 'var(--orange-light)' : 'var(--bg-secondary)',
                        border: formData.category === cat ? '2px solid var(--orange)' : '2px solid transparent',
                        color: formData.category === cat ? 'var(--orange)' : 'var(--text)'
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
                  Titre de l'annonce *
                </label>
                <input
                  name="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="input-search"
                  placeholder="Ex: Cours de yoga pour chats anxieux"
                />
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!formData.category || !formData.title}
                className="btn-orange w-full disabled:opacity-50"
              >
                Continuer
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="card p-6">
              <h2 className="text-lg font-bold mb-6" style={{ color: 'var(--text)' }}>
                Description et photos
              </h2>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
                  Description
                </label>
                <textarea
                  name="description"
                  rows={6}
                  value={formData.description}
                  onChange={handleChange}
                  className="input-search resize-none"
                  placeholder="Décrivez votre prestation douteuse en détail..."
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
                  Photo (URL)
                </label>
                <div className="relative">
                  <ImagePlus className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                  <input
                    name="imageUrl"
                    type="url"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className="input-search pl-12"
                    placeholder="https://exemple.com/image.jpg"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn-outline flex-1"
                >
                  Retour
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="btn-orange flex-1"
                >
                  Continuer
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="card p-6">
              <h2 className="text-lg font-bold mb-6" style={{ color: 'var(--text)' }}>
                Prix et localisation
              </h2>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
                  Prix *
                </label>
                <div className="relative">
                  <input
                    name="price"
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    className="input-search pr-12"
                    placeholder="0"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-medium" style={{ color: 'var(--text-secondary)' }}>€</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
                  Localisation
                </label>
                <input
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  className="input-search"
                  placeholder="Paris, Lyon, Marseille..."
                />
              </div>

              {/* Summary */}
              <div className="p-4 rounded-xl mb-6" style={{ background: 'var(--bg-tertiary)' }}>
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--orange)' }} />
                  <div>
                    <p className="font-medium text-sm mb-1" style={{ color: 'var(--text)' }}>Récapitulatif</p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <strong>{formData.title}</strong> dans la catégorie {formData.category} à {formData.price}€
                      {formData.location && ` - ${formData.location}`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="btn-outline flex-1"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-orange flex-1 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Publier mon annonce'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
