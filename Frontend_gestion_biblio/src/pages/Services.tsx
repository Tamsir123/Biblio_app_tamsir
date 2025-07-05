import React from 'react';
import { motion } from 'framer-motion';
import { Book, Users, MapPin, Clock, Computer, Database, Wifi, Coffee, Volume2, Headphones, Search, Download, Globe, Shield, HelpCircle, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Services = () => {
  const services = [
    {
      icon: <Search className="w-8 h-8" />,
      title: "Recherche Documentaire",
      description: "Assistance personnalisée pour vos recherches académiques et scientifiques",
      features: ["Aide à la recherche", "Formation aux bases de données", "Méthodologie documentaire", "Bibliographies spécialisées"],
      color: "text-blue-600"
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Bases de Données",
      description: "Accès à plus de 25 bases de données spécialisées en ingénierie",
      features: ["IEEE Xplore", "ScienceDirect", "SpringerLink", "Wiley Online Library"],
      color: "text-green-600"
    },
    {
      icon: <Book className="w-8 h-8" />,
      title: "Collection Numérique",
      description: "Plus de 15,000 ressources numériques accessibles 24h/24",
      features: ["E-books", "Articles scientifiques", "Thèses et mémoires", "Revues électroniques"],
      color: "text-purple-600"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Espaces d'Étude",
      description: "400 places de lecture dans des environnements adaptés",
      features: ["Salles silencieuses", "Espaces collaboratifs", "Carrels individuels", "Salles de groupe"],
      color: "text-orange-600"
    },
    {
      icon: <Computer className="w-8 h-8" />,
      title: "Équipements Tech",
      description: "Technologies modernes pour vos études et recherches",
      features: ["Ordinateurs", "Scanners", "Imprimantes", "Projecteurs"],
      color: "text-red-600"
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "Formation",
      description: "Ateliers et formations pour maîtriser les outils documentaires",
      features: ["Initiation à la recherche", "Citation et plagiat", "Outils de veille", "Zotero & Mendeley"],
      color: "text-indigo-600"
    }
  ];

  const espaces = [
    {
      name: "Salle de Lecture Principale",
      capacity: "200 places",
      description: "Espace calme pour la lecture et l'étude individuelle",
      amenities: ["Silence absolu", "Éclairage optimal", "Climatisation", "Prises électriques"],
      hours: "7h30 - 18h30"
    },
    {
      name: "Espace Collaboratif",
      capacity: "80 places",
      description: "Zone de travail en groupe avec équipements modernes",
      amenities: ["Discussions autorisées", "Tableaux blancs", "Écrans partagés", "Mobilier modulable"],
      hours: "8h00 - 18h00"
    },
    {
      name: "Carrels de Recherche",
      capacity: "40 postes",
      description: "Espaces individuels pour la recherche approfondie",
      amenities: ["Isolement phonique", "Connexion réseau", "Rangement personnel", "Réservation possible"],
      hours: "7h30 - 18h30"
    },
    {
      name: "Salle Multimédia",
      capacity: "30 postes",
      description: "Équipements informatiques et audiovisuels",
      amenities: ["Ordinateurs récents", "Logiciels spécialisés", "Casques audio", "Scanners"],
      hours: "8h00 - 17h00"
    }
  ];

  const horaires = [
    { jour: "Lundi - Vendredi", heures: "7h30 - 18h30", status: "Ouvert" },
    { jour: "Samedi", heures: "8h00 - 17h00", status: "Ouvert" },
    { jour: "Dimanche", heures: "Fermé", status: "Fermé" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-black h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1920&h=800&fit=crop" 
            alt="Services Bibliothèque" 
            className="w-full h-full object-cover opacity-70 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/90"></div>
        </div>
        
        <motion.div 
          className="relative z-10 text-center text-white px-4"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-light mb-6">Services</h1>
          <div className="w-20 h-0.5 bg-white mx-auto mb-6"></div>
          <p className="text-xl font-light max-w-2xl mx-auto opacity-90">
            Découvrez tous nos services et ressources pour votre réussite académique
          </p>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            Services E-Library 2iE
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Nos Services & Ressources
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            E-Library 2iE vous accompagne dans votre parcours académique avec des services modernes 
            et des ressources documentaires de qualité adaptées à l'ingénierie.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 group border-gray-200">
                <CardHeader className="text-center pb-4">
                  <div className={`mx-auto w-16 h-16 ${service.color} bg-gray-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {service.icon}
                  </div>
                  <CardTitle className="text-xl text-gray-900">{service.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Section avec Images Illustratives */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Votre Environnement d'Étude
            </h2>
            <p className="text-lg text-gray-600">
              Découvrez nos espaces modernes et nos équipements de pointe pour votre réussite
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Recherche Documentaire */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="relative group overflow-hidden rounded-2xl shadow-lg"
            >
              <img 
                src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop"
                alt="Recherche Documentaire"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold mb-2">Recherche Avancée</h3>
                <p className="text-sm opacity-90">Bases de données scientifiques</p>
              </div>
            </motion.div>

            {/* Espaces d'Étude */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="relative group overflow-hidden rounded-2xl shadow-lg"
            >
              <img 
                src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop"
                alt="Espaces d'Étude"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold mb-2">Espaces Modernes</h3>
                <p className="text-sm opacity-90">400 places de lecture</p>
              </div>
            </motion.div>

            {/* Technologies */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="relative group overflow-hidden rounded-2xl shadow-lg"
            >
              <img 
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop"
                alt="Technologies Modernes"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold mb-2">Tech Avancée</h3>
                <p className="text-sm opacity-90">Équipements numériques</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Section Statistiques avec Visuels */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-20 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                E-Library 2iE en Chiffres
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                  <div className="text-3xl font-bold text-blue-600 mb-2">15,000+</div>
                  <div className="text-sm text-gray-600">Ressources Numériques</div>
                </div>
                <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                  <div className="text-3xl font-bold text-green-600 mb-2">2,800+</div>
                  <div className="text-sm text-gray-600">Étudiants Actifs</div>
                </div>
                <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                  <div className="text-3xl font-bold text-purple-600 mb-2">25+</div>
                  <div className="text-sm text-gray-600">Bases de Données</div>
                </div>
                <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                  <div className="text-3xl font-bold text-orange-600 mb-2">400</div>
                  <div className="text-sm text-gray-600">Places de Lecture</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&h=600&fit=crop"
                alt="Bibliothèque Moderne"
                className="w-full h-80 object-cover rounded-2xl shadow-xl"
              />
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                24/7
              </div>
            </div>
          </div>
        </motion.div>

        {/* Espaces Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nos Espaces d'Étude
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              400 places de lecture réparties dans des espaces adaptés à tous vos besoins d'étude et de recherche.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {espaces.map((espace, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-gray-900">{espace.name}</CardTitle>
                        <CardDescription className="text-blue-600 font-medium">
                          {espace.capacity}
                        </CardDescription>
                      </div>
                      <div className="flex items-center text-green-600 text-sm">
                        <Clock className="w-4 h-4 mr-1" />
                        {espace.hours}
                      </div>
                    </div>
                    <p className="text-gray-600 mt-2">{espace.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {espace.amenities.map((amenity, idx) => (
                        <div key={idx} className="flex items-center text-sm text-gray-700">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                          {amenity}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Horaires Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Horaires d'Ouverture
            </h2>
            <p className="text-lg text-gray-600">
              E-Library 2iE est ouverte du lundi au samedi pour vous accompagner dans vos études.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image d'illustration */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="relative"
            >
              <img 
                src="https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&h=600&fit=crop"
                alt="Bibliothèque Ouverture"
                className="w-full h-96 object-cover rounded-2xl shadow-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 to-transparent rounded-2xl"></div>
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center text-green-600 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="font-medium text-sm">Actuellement Ouvert</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>

            {/* Tableau des horaires */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
                <CardContent className="p-0">
                  {horaires.map((horaire, index) => (
                    <div key={index} className={`flex justify-between items-center p-6 ${index !== horaires.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-blue-50/50 transition-colors`}>
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                          <Clock className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900 text-lg">{horaire.jour}</span>
                          <div className="text-sm text-gray-500">Bibliothèque</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-medium text-gray-900 mb-1">{horaire.heures}</div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          horaire.status === 'Ouvert' 
                            ? 'bg-green-100 text-green-700 border border-green-200' 
                            : 'bg-red-100 text-red-700 border border-red-200'
                        }`}>
                          {horaire.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              {/* Info supplémentaire */}
              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-center text-blue-800 mb-2">
                  <Globe className="w-5 h-5 mr-2" />
                  <span className="font-medium">Accès 24h/24 aux ressources numériques</span>
                </div>
                <p className="text-sm text-blue-700">
                  Vos ressources électroniques sont disponibles en ligne à tout moment avec votre compte étudiant.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Services;
