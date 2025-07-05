
import PageLayout from '@/components/PageLayout';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import WhyELibrary from '@/components/WhyELibrary';
import SEO from '@/components/SEO';
import InteractiveBentoGallery from '@/components/ui/interactive-bento-gallery';
import { useEffect } from 'react';

const Index = () => {
  // Fix any ID conflicts when the page loads
  useEffect(() => {
    const contactElements = document.querySelectorAll('[id="contact"]');
    if (contactElements.length > 1) {
      // If there are multiple elements with id="contact", rename one
      contactElements[1].id = 'contact-footer';
    }
  }, []);

  // Données pour la galerie de la bibliothèque
  const libraryMediaItems = [
    {
      id: 1,
      type: "image",
      title: "Salle de Lecture Moderne",
      desc: "400 places dans un environnement d'étude optimal",
      url: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&h=600&fit=crop",
      span: "md:col-span-2 md:row-span-3 sm:col-span-2 sm:row-span-2",
    },
    {
      id: 2,
      type: "video",
      title: "Visite Virtuelle",
      desc: "Découvrez nos espaces en vidéo",
      url: "https://videos.pexels.com/video-files/5198159/5198159-sd_640_360_25fps.mp4",
      span: "md:col-span-2 md:row-span-2 col-span-1 sm:col-span-2 sm:row-span-2",
    },
    {
      id: 3,
      type: "image",
      title: "Collection Numérique",
      desc: "15,000+ ressources électroniques",
      url: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop",
      span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2",
    },
    {
      id: 4,
      type: "image",
      title: "Espaces Collaboratifs",
      desc: "Zones de travail en groupe équipées",
      url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop",
      span: "md:col-span-2 md:row-span-2 sm:col-span-2 sm:row-span-2",
    },
    {
      id: 5,
      type: "video",
      title: "Technologies Avancées",
      desc: "Équipements numériques de pointe",
      url: "https://videos.pexels.com/video-files/3129671/3129671-sd_640_360_30fps.mp4",
      span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2",
    },
    {
      id: 6,
      type: "image",
      title: "Recherche Documentaire",
      desc: "Accès aux bases de données mondiales",
      url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
      span: "md:col-span-2 md:row-span-2 sm:col-span-2 sm:row-span-2",
    },
    {
      id: 7,
      type: "image",
      title: "Ambiance d'Étude",
      desc: "Environnement calme et inspirant",
      url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop",
      span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2",
    },
  ];

  return (
    <PageLayout showContact={false}>
      <SEO 
        title="Bibliothèque Moderne - Système de Gestion Numérique" 
        description="Découvrez notre bibliothèque moderne avec catalogue numérique, système d'emprunt intelligent et services en ligne pour tous vos besoins de lecture et recherche."
        imageUrl="/lovable-uploads/48e540e5-6a25-44e4-b3f7-80f3bfc2777a.png"
        keywords={['bibliothèque', 'catalogue numérique', 'emprunt de livres', 'gestion bibliothèque', 'recherche documentaire', 'ressources numériques', 'lecture']}
      />
      <Hero />
      <Features />
      
      {/* Galerie Interactive de la Bibliothèque */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <InteractiveBentoGallery
          mediaItems={libraryMediaItems}
          title="Découvrez E-Library 2iE"
          description="Explorez nos espaces modernes et nos services innovants à travers cette galerie interactive"
        />
      </section>
      
      <WhyELibrary />
    </PageLayout>
  );
};

export default Index;
