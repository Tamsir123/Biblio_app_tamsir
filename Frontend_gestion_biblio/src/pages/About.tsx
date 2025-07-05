
import { ArrowLeft, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import InteractiveBentoGallery from '@/components/ui/interactive-bento-gallery';

const About = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Données pour la galerie interactive
  const mediaItems = [
    {
      id: 1,
      type: "image",
      title: "Salle de Lecture Principale",
      desc: "200 places dans un environnement calme et moderne",
      url: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&h=600&fit=crop",
      span: "md:col-span-2 md:row-span-3 sm:col-span-2 sm:row-span-3",
    },
    {
      id: 2,
      type: "video",
      title: "Visite Virtuelle",
      desc: "Découvrez nos espaces d'étude modernes",
      url: "https://videos.pexels.com/video-files/5198159/5198159-sd_640_360_25fps.mp4",
      span: "md:col-span-2 md:row-span-2 col-span-1 sm:col-span-2 sm:row-span-2",
    },
    {
      id: 3,
      type: "image",
      title: "Espace Collaboratif",
      desc: "Zones de travail en groupe équipées",
      url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop",
      span: "md:col-span-1 md:row-span-2 sm:col-span-1 sm:row-span-2",
    },
    {
      id: 4,
      type: "image",
      title: "Collection Numérique",
      desc: "15,000+ ressources en ligne",
      url: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop",
      span: "md:col-span-1 md:row-span-2 sm:col-span-1 sm:row-span-2",
    },
    {
      id: 5,
      type: "image",
      title: "Carrels de Recherche",
      desc: "40 espaces individuels pour la recherche",
      url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop",
      span: "md:col-span-1 md:row-span-2 sm:col-span-1 sm:row-span-2",
    },
    {
      id: 6,
      type: "image",
      title: "Équipements Modernes",
      desc: "Technologies de pointe pour vos études",
      url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop",
      span: "md:col-span-2 md:row-span-2 sm:col-span-2 sm:row-span-2",
    },
    {
      id: 7,
      type: "image",
      title: "Centre de Formation",
      desc: "Ateliers et formations documentaires",
      url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop",
      span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2",
    },
  ];
  
  return (
    <PageLayout>
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <Link to="/" className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-6 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
            
            <motion.h1 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5 }} 
              className="text-4xl font-bold mb-6"
            >
              À Propos d'E-Library 2iE
            </motion.h1>
            
            <div className="prose prose-lg max-w-none">
              <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ duration: 0.5, delay: 0.2 }} 
                className="text-xl text-gray-600 mb-12"
              >
                Nous sommes une équipe d'experts dédiée à l'excellence dans les services documentaires et l'accompagnement des futurs ingénieurs africains.
              </motion.p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ duration: 0.6 }}
                  className="space-y-6"
                >
                  <h2 className="text-3xl font-bold">Notre Mission</h2>
                  <p className="text-gray-600">
                    À E-Library 2iE, nous avons pour mission de transformer l'accès à l'information en créant 
                    un environnement d'apprentissage moderne qui stimule la recherche, l'innovation et l'excellence académique.
                  </p>
                  <p className="text-gray-600">
                    Nous croyons qu'en rendant la connaissance accessible et en accompagnant nos utilisateurs, nous pouvons 
                    contribuer à former les leaders de demain dans le domaine de l'ingénierie en Afrique.
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-gray-50 rounded-2xl p-8 border border-gray-100"
                >
                  <h3 className="text-2xl font-bold mb-4">Nos Valeurs</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-gray-700 mt-1 mr-3 flex-shrink-0" />
                      <span><strong>Excellence :</strong> Nous nous engageons à fournir des services de qualité supérieure et des ressources pertinentes.</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-gray-700 mt-1 mr-3 flex-shrink-0" />
                      <span><strong>Accessibilité :</strong> Nous garantissons un accès équitable à l'information pour tous nos utilisateurs.</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-gray-700 mt-1 mr-3 flex-shrink-0" />
                      <span><strong>Innovation :</strong> Nous adoptons les technologies modernes pour améliorer l'expérience utilisateur.</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-gray-700 mt-1 mr-3 flex-shrink-0" />
                      <span><strong>Accompagnement :</strong> Nous mesurons notre succès par la réussite académique de nos étudiants et chercheurs.</span>
                    </li>
                  </ul>
                </motion.div>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mb-16"
              >
                <h2 className="text-3xl font-bold mb-6">Notre Histoire</h2>
                <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                  <p className="text-gray-600 mb-4">
                    Fondée en 1968, l'Institut International d'Ingénierie de l'Eau et de l'Environnement (2iE) a créé E-Library 2iE 
                    avec l'ambition de devenir le centre de référence documentaire pour l'ingénierie en Afrique de l'Ouest. 
                    Dès les premières années, nous avons constitué un fonds spécialisé unique dans la région.
                  </p>
                  <p className="text-gray-600 mb-4">
                    Au fil des décennies, E-Library 2iE s'est modernisée pour répondre aux besoins évolutifs de nos étudiants 
                    et chercheurs. Nous avons développé des collections numériques, des espaces d'étude collaboratifs et des services 
                    de recherche documentaire avancés - toujours dans l'objectif de soutenir l'excellence académique et l'innovation.
                  </p>
                  <p className="text-gray-600">
                    Aujourd'hui, E-Library 2iE offre un accès 24h/24 à plus de 50 000 ressources numériques, 
                    des bases de données internationales et des outils de recherche de pointe. Nous continuons à évoluer 
                    pour accompagner les futurs ingénieurs africains dans leur quête de connaissances et d'innovation.
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mb-16"
              >
                <h2 className="text-3xl font-bold mb-6">Notre Équipe</h2>
                <p className="text-gray-600 mb-8">
                  Notre équipe diversifiée combine expertise en sciences de l'information, technologie numérique, 
                  gestion documentaire et pédagogie pour offrir des services d'excellence aux étudiants et chercheurs.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      name: "Dr. Salimata Sawadogo",
                      role: "Directrice d'E-Library 2iE",
                      bio: "Docteure en Sciences de l'Information, elle dirige E-Library 2iE avec une vision moderne de l'accès à l'information.",
                      image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=300&h=300&fit=crop&crop=face"
                    },
                    {
                      name: "Amadou Traoré",
                      role: "Responsable Services Numériques",
                      bio: "Spécialiste en technologies de l'information, il développe nos plateformes numériques et services en ligne.",
                      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face"
                    },
                    {
                      name: "Fatimata Ouédraogo",
                      role: "Bibliothécaire Référence",
                      bio: "Experte en recherche documentaire, elle accompagne les étudiants dans leurs travaux de recherche.",
                      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face"
                    },
                    {
                      name: "Issa Compaoré",
                      role: "Responsable Collections",
                      bio: "Gestionnaire des acquisitions et du développement des collections spécialisées en ingénierie.",
                      image: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=300&h=300&fit=crop&crop=face"
                    }
                  ].map((member, i) => (
                    <Card key={i} className="bg-gray-50 border border-gray-100 overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center">
                          <div className="w-32 h-32 relative mb-4 rounded-full overflow-hidden">
                            <img 
                              src={member.image} 
                              alt={member.name} 
                              className="w-full h-full object-cover filter grayscale" 
                            />
                          </div>
                          <h3 className="font-bold text-lg">{member.name}</h3>
                          <p className="text-gray-500 text-sm mb-2">{member.role}</p>
                          <p className="text-gray-600 text-sm">{member.bio}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Section Galerie Interactive */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8, delay: 0.4 }}
              className="my-20"
            >
              <InteractiveBentoGallery
                mediaItems={mediaItems}
                title="Découvrez E-Library 2iE"
                description="Explorez nos espaces modernes et nos équipements de pointe à travers cette galerie interactive"
              />
            </motion.div>
            
            <div className="mt-16 pt-8 border-t border-gray-200">
              <Link to="/careers" className="inline-flex items-center px-5 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all group">
                Rejoignez Notre Équipe
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default About;
