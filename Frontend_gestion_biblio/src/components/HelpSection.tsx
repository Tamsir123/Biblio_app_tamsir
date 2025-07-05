import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, BookOpen, Play, MessageCircle, ArrowRight, FileText, Video, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const HelpSection = () => {
  const navigate = useNavigate();

  const helpFeatures = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Guides d'utilisation",
      description: "Tutoriels étape par étape pour maîtriser toutes les fonctionnalités",
      color: "bg-blue-500",
      count: "12 guides"
    },
    {
      icon: <Play className="w-8 h-8" />,
      title: "Tutoriels vidéo",
      description: "Apprenez visuellement avec nos vidéos explicatives",
      color: "bg-green-500",
      count: "8 vidéos"
    },
    {
      icon: <HelpCircle className="w-8 h-8" />,
      title: "FAQ Interactive",
      description: "Trouvez rapidement les réponses à vos questions",
      color: "bg-purple-500",
      count: "25 questions"
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Support en ligne",
      description: "Assistance personnalisée par notre équipe",
      color: "bg-orange-500",
      count: "24/7"
    }
  ];

  const quickHelp = [
    {
      title: "Première connexion",
      description: "Comment accéder à votre compte E-Library",
      icon: <Users className="w-5 h-5" />,
      duration: "2 min"
    },
    {
      title: "Recherche avancée",
      description: "Maîtrisez les techniques de recherche",
      icon: <FileText className="w-5 h-5" />,
      duration: "5 min"
    },
    {
      title: "Gestion des emprunts",
      description: "Emprunter et renouveler vos livres",
      icon: <BookOpen className="w-5 h-5" />,
      duration: "3 min"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-4 px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
            Aide & Support
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Besoin d'aide pour utiliser E-Library ?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez tous nos outils et ressources pour tirer le meilleur parti de votre bibliothèque numérique
          </p>
        </motion.div>

        {/* Fonctionnalités principales */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {helpFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 group cursor-pointer border-2 border-transparent hover:border-indigo-200">
                <CardContent className="p-6 text-center">
                  <div className={`${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {feature.description}
                  </p>
                  <div className="text-sm font-medium text-indigo-600">
                    {feature.count}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Section aide rapide et CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Aide rapide */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Aide rapide
            </h3>
            <div className="space-y-4">
              {quickHelp.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="bg-indigo-100 rounded-lg p-3 mr-4">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  <div className="text-xs text-gray-500 ml-4">
                    {item.duration}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="bg-gradient-to-br from-indigo-600 to-blue-700 text-white overflow-hidden relative">
              <CardContent className="p-8">
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                    <HelpCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">
                    Centre d'aide complet
                  </h3>
                  <p className="text-indigo-100 mb-6">
                    Accédez à tous nos guides, tutoriels vidéo, FAQ et support personnalisé. 
                    Tout ce dont vous avez besoin pour maîtriser E-Library 2iE.
                  </p>
                  <ul className="space-y-2 mb-8">
                    <li className="flex items-center text-indigo-100">
                      <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                      Guides étape par étape
                    </li>
                    <li className="flex items-center text-indigo-100">
                      <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                      Vidéos explicatives
                    </li>
                    <li className="flex items-center text-indigo-100">
                      <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                      Support en temps réel
                    </li>
                  </ul>
                  <Button 
                    onClick={() => navigate('/help')}
                    className="bg-white text-indigo-600 hover:bg-gray-100 font-semibold"
                  >
                    Accéder au centre d'aide
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full"></div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HelpSection;
