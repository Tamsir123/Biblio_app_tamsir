import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Bell, BookOpen, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import VideoPlayer from '@/components/ui/video-player';
import InteractiveBentoGallery from '@/components/ui/interactive-bento-gallery';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Events = () => {
  // Événements à venir
  const upcomingEvents = [
    {
      id: 1,
      title: "Atelier Zotero : Gestion des références",
      date: "2025-07-15",
      time: "14h00 - 16h00",
      location: "Salle de Formation",
      category: "Formation",
      description: "Apprenez à utiliser Zotero pour organiser vos sources et générer vos bibliographies.",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      title: "Conférence : IA en Ingénierie",
      date: "2025-07-20",
      time: "09h00 - 11h00",
      location: "Amphithéâtre Principal",
      category: "Conférence",
      description: "Découvrez les applications de l'IA dans les différents domaines de l'ingénierie.",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      title: "Journée Portes Ouvertes",
      date: "2025-07-25",
      time: "08h00 - 18h00",
      location: "E-Library 2iE",
      category: "Événement",
      description: "Visitez notre bibliothèque et découvrez tous nos services.",
      image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400&h=300&fit=crop"
    }
  ];

  // Actualités récentes
  const newsArticles = [
    {
      id: 1,
      title: "Nouveau partenariat avec IEEE Xplore",
      date: "2025-06-28",
      category: "Partenariat",
      excerpt: "E-Library 2iE renforce son offre avec un accès étendu à IEEE Xplore.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      title: "Extension des horaires d'ouverture",
      date: "2025-06-25",
      category: "Annonce",
      excerpt: "Ouverture jusqu'à 22h pendant la période d'examens.",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      title: "Nouvelles acquisitions numériques",
      date: "2025-06-20",
      category: "Collection",
      excerpt: "47 nouveaux ouvrages ajoutés à notre collection numérique.",
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop"
    }
  ];

  // Données pour la galerie des événements
  const eventsGalleryItems = [
    {
      id: 1,
      type: "image",
      title: "Conférences Inspirantes",
      desc: "Rencontrez des experts du domaine",
      url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
      span: "md:col-span-2 md:row-span-3 sm:col-span-2 sm:row-span-2",
    },
    {
      id: 2,
      type: "video",
      title: "Ateliers Pratiques",
      desc: "Formations interactives et engageantes",
      url: "https://videos.pexels.com/video-files/5198159/5198159-sd_640_360_25fps.mp4",
      span: "md:col-span-2 md:row-span-2 col-span-1 sm:col-span-2 sm:row-span-2",
    },
    {
      id: 3,
      type: "image",
      title: "Networking",
      desc: "Échanges entre étudiants et professionnels",
      url: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop",
      span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2",
    },
    {
      id: 4,
      type: "image",
      title: "Journées Portes Ouvertes",
      desc: "Découvrez nos installations",
      url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop",
      span: "md:col-span-2 md:row-span-2 sm:col-span-2 sm:row-span-2",
    },
    {
      id: 5,
      type: "image",
      title: "Expositions",
      desc: "Art et culture au cœur de l'université",
      url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-black h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?w=1920&h=800&fit=crop" 
            alt="Événements Bibliothèque" 
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/90"></div>
        </div>
        
        <motion.div 
          className="relative z-10 text-center text-white px-4"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-light mb-6">Événements & Actualités</h1>
          <div className="w-20 h-0.5 bg-white mx-auto mb-6"></div>
          <p className="text-xl font-light max-w-2xl mx-auto opacity-90">
            Restez informé de l'actualité de votre bibliothèque
          </p>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 py-16">
        
        {/* Section Événements */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <div className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              Événements à venir
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Prochains Événements
            </h2>
            <p className="text-lg text-gray-600">
              Participez à nos événements et formations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  <div className="relative">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-3 left-3 bg-blue-600">
                      {event.category}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {event.description}
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                        {new Date(event.date).toLocaleDateString('fr-FR', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2 text-green-500" />
                        {event.time}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-red-500" />
                        {event.location}
                      </div>
                    </div>
                    <Button className="w-full">
                      S'inscrire
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Section Actualités */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <div className="inline-block mb-4 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              Actualités
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Dernières Nouvelles
            </h2>
            <p className="text-lg text-gray-600">
              Restez au courant des dernières actualités
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="relative">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-full h-48 object-cover"
                    />
                    <Badge variant="outline" className="absolute top-3 left-3 bg-white/90">
                      {article.category}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {new Date(article.date).toLocaleDateString('fr-FR')}
                      </span>
                      <Button variant="outline" size="sm">
                        Lire plus
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Section Vidéo de Présentation */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <div className="inline-block mb-4 px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
              Découvrez E-Library 2iE
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Visite Virtuelle
            </h2>
            <p className="text-lg text-gray-600">
              Découvrez nos espaces et services en vidéo
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <VideoPlayer src="https://videos.pexels.com/video-files/5198159/5198159-sd_640_360_25fps.mp4" />
            
            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">
                Une visite guidée de nos espaces modernes et de nos équipements de pointe
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center text-sm text-gray-600">
                  <BookOpen className="w-4 h-4 mr-2 text-blue-500" />
                  <span>15,000+ ressources</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2 text-green-500" />
                  <span>400 places d'étude</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2 text-purple-500" />
                  <span>Ouvert 6j/7</span>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Galerie Interactive des Événements */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8"
        >
          <InteractiveBentoGallery
            mediaItems={eventsGalleryItems}
            title="Moments Forts de nos Événements"
            description="Revivez l'ambiance de nos événements passés et découvrez ce qui vous attend"
          />
        </motion.section>

      </div>

      <Footer />
    </div>
  );
};

export default Events;
