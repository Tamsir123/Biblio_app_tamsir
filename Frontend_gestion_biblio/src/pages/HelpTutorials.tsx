import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HelpCircle, 
  BookOpen, 
  Play, 
  MessageCircle, 
  Search, 
  ChevronDown, 
  ChevronRight,
  FileText,
  Video,
  Users,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import VideoPlayer from '@/components/ui/video-player';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const HelpTutorials = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  // Guides d'utilisation
  const guides = [
    {
      id: 1,
      title: "Guide de recherche avancée",
      description: "Maîtrisez les techniques de recherche dans notre catalogue",
      icon: <Search className="w-6 h-6" />,
      category: "Recherche",
      duration: "5 min",
      difficulty: "Débutant",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      title: "Gestion des emprunts",
      description: "Apprenez à emprunter et renouveler vos livres",
      icon: <BookOpen className="w-6 h-6" />,
      category: "Emprunt",
      duration: "3 min",
      difficulty: "Débutant",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      title: "Accès aux ressources numériques",
      description: "Consultez nos bases de données et e-books",
      icon: <FileText className="w-6 h-6" />,
      category: "Numérique",
      duration: "7 min",
      difficulty: "Intermédiaire",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop"
    },
    {
      id: 4,
      title: "Utilisation de Zotero",
      description: "Organisez vos références bibliographiques",
      icon: <Users className="w-6 h-6" />,
      category: "Outils",
      duration: "10 min",
      difficulty: "Avancé",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop"
    }
  ];

  // Tutoriels vidéo
  const videoTutorials = [
    {
      id: 1,
      title: "Première connexion à E-Library",
      description: "Découvrez comment accéder à votre compte pour la première fois",
      duration: "2:30",
      views: "1.2k",
      videoUrl: "https://videos.pexels.com/video-files/5198159/5198159-sd_640_360_25fps.mp4",
      thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      title: "Recherche multicritères",
      description: "Utilisez les filtres avancés pour trouver exactement ce que vous cherchez",
      duration: "4:15",
      views: "856",
      videoUrl: "https://videos.pexels.com/video-files/5198159/5198159-sd_640_360_25fps.mp4",
      thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      title: "Réservation en ligne",
      description: "Réservez vos ouvrages depuis chez vous",
      duration: "3:45",
      views: "643",
      videoUrl: "https://videos.pexels.com/video-files/5198159/5198159-sd_640_360_25fps.mp4",
      thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop"
    }
  ];

  // FAQ
  const faqItems = [
    {
      id: 1,
      question: "Comment puis-je accéder à mon compte étudiant ?",
      answer: "Utilisez votre numéro d'étudiant et le mot de passe fourni lors de votre inscription. En cas d'oubli, contactez le service informatique."
    },
    {
      id: 2,
      question: "Combien de livres puis-je emprunter simultanément ?",
      answer: "Les étudiants peuvent emprunter jusqu'à 5 ouvrages simultanément pour une durée de 15 jours, renouvelable une fois."
    },
    {
      id: 3,
      question: "Comment accéder aux ressources numériques depuis chez moi ?",
      answer: "Connectez-vous à votre compte E-Library et accédez à la section 'Ressources Numériques'. Une authentification via VPN peut être requise."
    },
    {
      id: 4,
      question: "Que faire si un livre que je cherche n'est pas disponible ?",
      answer: "Vous pouvez faire une demande d'acquisition via le formulaire en ligne ou demander un prêt entre bibliothèques."
    },
    {
      id: 5,
      question: "Comment renouveler mes emprunts ?",
      answer: "Connectez-vous à votre espace personnel et cliquez sur 'Renouveler' à côté de chaque ouvrage. Le renouvellement est possible si aucune réservation n'est en cours."
    }
  ];

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  const filteredGuides = guides.filter(guide =>
    guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-900 to-indigo-900 h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1920&h=800&fit=crop" 
            alt="Aide et Tutoriels" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        
        <motion.div 
          className="relative z-10 text-center text-white px-4"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Aide & Tutoriels</h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            Trouvez toutes les ressources pour maîtriser E-Library 2iE
          </p>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Barre de recherche */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Rechercher dans l'aide..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-4 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500"
              />
            </div>
          </div>
        </motion.div>

        {/* Guides d'utilisation */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <div className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              Guides d'utilisation
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Apprenez à utiliser E-Library
            </h2>
            <p className="text-lg text-gray-600">
              Des guides pas à pas pour maîtriser toutes les fonctionnalités
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredGuides.map((guide, index) => (
              <motion.div
                key={guide.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 group cursor-pointer">
                  <div className="relative">
                    <img 
                      src={guide.image} 
                      alt={guide.title}
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-blue-600">{guide.category}</Badge>
                    </div>
                    <div className="absolute top-3 right-3 bg-white/90 rounded-full p-2">
                      {guide.icon}
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                      {guide.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {guide.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {guide.duration}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {guide.difficulty}
                      </Badge>
                    </div>
                    <Button className="w-full group-hover:bg-blue-700 transition-colors">
                      Consulter le guide
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Tutoriels vidéo */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <div className="inline-block mb-4 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              Tutoriels vidéo
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Apprenez en regardant
            </h2>
            <p className="text-lg text-gray-600">
              Des vidéos courtes et pratiques pour vous guider
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Vidéo principale */}
            <div className="lg:col-span-2 mb-8">
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Tutoriel en vedette</h3>
                  <VideoPlayer src={videoTutorials[0].videoUrl} />
                  <div className="mt-4">
                    <h4 className="font-semibold text-lg">{videoTutorials[0].title}</h4>
                    <p className="text-gray-600">{videoTutorials[0].description}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Liste des autres vidéos */}
            {videoTutorials.slice(1).map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                  <div className="flex">
                    <div className="relative w-32 h-24 flex-shrink-0">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Play className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <CardContent className="p-4 flex-1">
                      <h4 className="font-semibold mb-1">{video.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{video.description}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <span>{video.duration}</span>
                        <span className="mx-2">•</span>
                        <span>{video.views} vues</span>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* FAQ Interactive */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <div className="inline-block mb-4 px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
              FAQ Interactive
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Questions Fréquentes
            </h2>
            <p className="text-lg text-gray-600">
              Trouvez rapidement les réponses à vos questions
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {faqItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="mb-4"
              >
                <Card className="overflow-hidden">
                  <CardHeader 
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleFAQ(item.id)}
                  >
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{item.question}</CardTitle>
                      <ChevronDown 
                        className={`w-5 h-5 transition-transform ${
                          openFAQ === item.id ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </CardHeader>
                  {openFAQ === item.id && (
                    <CardContent className="pt-0">
                      <p className="text-gray-600">{item.answer}</p>
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Support en ligne */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-20"
        >
          <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardContent className="p-8 text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Besoin d'aide personnalisée ?</h3>
              <p className="text-lg opacity-90 mb-6">
                Notre équipe est là pour vous accompagner
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="bg-white text-blue-600 hover:bg-gray-100">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat en ligne
                </Button>
                <Button variant="outline" className="bg-white text-blue-600 hover:bg-gray-100">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Ticket de support
                </Button>
                <Button variant="outline" className="bg-white text-blue-600 hover:bg-gray-100">
                  <Users className="w-4 h-4 mr-2" />
                  Prendre RDV
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>

      <Footer />
    </div>
  );
};

export default HelpTutorials;
