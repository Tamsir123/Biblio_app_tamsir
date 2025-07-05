import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ChevronLeft, ChevronRight, Users, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  genre: string;
  description: string;
  total_quantity: number;
  available_quantity: number;
  publication_year: number;
  created_at: string;
  cover_image?: string;
}

const Projects = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const catalogRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const isMobile = useIsMobile();

  // Récupération des livres depuis l'API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/books?limit=8');
        if (response.ok) {
          const data = await response.json();
          const booksArray = Array.isArray(data?.data?.books) ? data.data.books : [];
          setBooks(booksArray);
        } else {
          console.error('Erreur lors de la récupération des livres');
        }
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Auto-scroll du carrousel
  useEffect(() => {
    if (isInView && !isHovering && books.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % books.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isInView, isHovering, books.length]);

  // Observer pour détecter quand la section est visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.3 }
    );
    
    if (catalogRef.current) {
      observer.observe(catalogRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  // Fonction pour obtenir l'image du livre (harmonisée avec Catalogue.tsx)
  const getBookImage = (book: Book) => {
    // Priorité 1: Image réelle uploadée lors de l'ajout du livre
    if (book.cover_image) {
      if (book.cover_image.startsWith('/uploads/') || book.cover_image.startsWith('uploads/')) {
        return `http://localhost:5000/${book.cover_image.startsWith('/') ? book.cover_image.slice(1) : book.cover_image}`;
      }
      if (book.cover_image.startsWith('http')) {
        return book.cover_image;
      }
      return `http://localhost:5000/uploads/${book.cover_image}`;
    }

    // Priorité 2: Images spécifiques par livre
    const bookImages: { [key: number]: string } = {
      1: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&h=400&fit=crop',
      2: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop',
      3: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=300&h=400&fit=crop',
      4: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop',
      5: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=300&h=400&fit=crop',
      6: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=300&h=400&fit=crop',
      7: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=400&fit=crop',
      8: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=300&h=400&fit=crop',
      9: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=300&h=400&fit=crop',
      10: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=400&fit=crop',
      11: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=300&h=400&fit=crop',
      12: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=400&fit=crop'
    };

    if (bookImages[book.id]) {
      return bookImages[book.id];
    }

    // Priorité 3: Images par genre
    const genreImages: { [key: string]: string } = {
      'Technologie': 'https://images.unsplash.com/photo-1518709268805-4e9042af2ea0?w=300&h=400&fit=crop',
      'Histoire': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop',
      'Sciences': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop',
      'Littérature': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop',
      'Ingénierie': 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=300&h=400&fit=crop',
      'Économie': 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=300&h=400&fit=crop',
      'Informatique': 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=300&h=400&fit=crop',
      'Environnement': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=400&fit=crop',
      'Sociologie': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&h=400&fit=crop',
      'Marketing': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=400&fit=crop'
    };

    return genreImages[book.genre] || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop';
  };

  const nextSlide = () => {
    setCurrentIndex(prev => (prev + 1) % books.length);
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev - 1 + books.length) % books.length);
  };

  const getVisibleBooks = () => {
    if (books.length === 0) return [];
    
    const visibleCount = isMobile ? 1 : 3;
    const visible = [];
    
    for (let i = 0; i < visibleCount; i++) {
      const index = (currentIndex + i) % books.length;
      visible.push(books[index]);
    }
    
    return visible;
  };

  if (loading) {
    return (
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement du catalogue...</p>
          </div>
        </div>
      </section>
    );
  }

  if (books.length === 0) {
    return (
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun livre disponible</h3>
            <p className="text-gray-600">Le catalogue sera bientôt disponible.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      id="catalog" 
      ref={catalogRef} 
      className="relative py-16 md:py-20 bg-gradient-to-br from-slate-50 via-white to-gray-50 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-black/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-gray-900/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* En-tête élégant */}
        <motion.div 
          className="text-center mb-12 md:mb-14"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center mb-4 px-6 py-3 bg-gradient-to-r from-gray-900 to-black text-white rounded-full text-sm font-medium shadow-lg">
            <BookOpen className="w-4 h-4 mr-2" />
            Collection E-Library 2iE
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-4 leading-tight">
            Notre Collection<br />
            <span className="text-2xl md:text-3xl lg:text-4xl font-light">d'Excellence</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-6">
            Découvrez une sélection premium de livres académiques et de recherche
          </p>
          
          {/* Section d'introduction interactive */}
          <motion.div 
            className="max-w-3xl mx-auto mb-8 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center justify-center mb-4">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-gradient-to-r from-gray-500 to-gray-700 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-3 h-3 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Navigation Interactive
            </h3>
            <p className="text-gray-700 leading-relaxed">
              <span className="font-medium">Naviguez facilement</span> dans notre catalogue : utilisez les 
              <span className="inline-flex items-center mx-2 px-2 py-1 bg-gray-100 rounded-md text-sm">
                <ChevronLeft className="w-3 h-3 mr-1" />
                flèches
                <ChevronRight className="w-3 h-3 ml-1" />
              </span>
              sur ordinateur ou <span className="font-medium">glissez horizontalement</span> sur mobile pour découvrir nos ouvrages.
            </p>
          </motion.div>
        </motion.div>

        {/* Carrousel premium */}
        <div 
          className="relative"
          onMouseEnter={() => setIsHovering(true)} 
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Contrôles élégants */}
          {!isMobile && books.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-16 h-16 bg-white/90 backdrop-blur-sm hover:bg-white rounded-2xl shadow-2xl border border-gray-200/50 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-3xl group"
                aria-label="Livre précédent"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700 group-hover:text-black transition-colors" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-16 h-16 bg-white/90 backdrop-blur-sm hover:bg-white rounded-2xl shadow-2xl border border-gray-200/50 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-3xl group"
                aria-label="Livre suivant"
              >
                <ChevronRight className="w-6 h-6 text-gray-700 group-hover:text-black transition-colors" />
              </button>
            </>
          )}

          {/* Container du carrousel avec perspective */}
          <div className="relative mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 px-8 md:px-20">
              <AnimatePresence mode="wait">
                {getVisibleBooks().map((book, index) => (
                  <motion.div
                    key={`${book.id}-${currentIndex}-${index}`}
                    initial={{ opacity: 0, y: 40, rotateY: -15 }}
                    animate={{ opacity: 1, y: 0, rotateY: 0 }}
                    exit={{ opacity: 0, y: -40, rotateY: 15 }}
                    transition={{ 
                      duration: 0.7, 
                      delay: index * 0.15,
                      type: "spring",
                      stiffness: 100,
                      damping: 20
                    }}
                    className="group perspective-1000"
                    style={{ perspective: '1000px' }}
                  >
                    {/* Carte livre premium */}
                    <div 
                      className="relative transform transition-all duration-700 preserve-3d group-hover:rotateY-12"
                      style={{ 
                        transformStyle: 'preserve-3d',
                        transition: 'transform 0.7s ease-in-out'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'rotateY(8deg) translateY(-20px) scale(1.02)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'rotateY(0deg) translateY(0px) scale(1)';
                      }}
                    >
                      <Card 
                        className="relative overflow-hidden bg-white border-0 rounded-3xl group-hover:-translate-y-8 group-hover:scale-105"
                        style={{
                          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                          transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = '0 50px 100px -20px rgba(0, 0, 0, 0.25)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.15)';
                        }}
                      >
                        {/* Image avec overlay sophistiqué */}
                        <div className="relative h-72 overflow-hidden rounded-t-3xl">
                          <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/40 z-10"></div>
                          <img
                            src={getBookImage(book)}
                            alt={book.title}
                            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                            style={{
                              filter: 'contrast(1.1) saturate(1.2)'
                            }}
                          />
                          
                          {/* Overlays et badges premium */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 z-20"></div>
                          
                          {/* Badge de disponibilité sophistiqué */}
                          <div className="absolute top-6 right-6 z-30">
                            <div className={`px-4 py-2 rounded-full backdrop-blur-md border text-xs font-semibold tracking-wide ${
                              book.available_quantity > 0 
                                ? "bg-emerald-500/20 border-emerald-400/30 text-emerald-100" 
                                : "bg-red-500/20 border-red-400/30 text-red-100"
                            }`}>
                              {book.available_quantity > 0 ? 'DISPONIBLE' : 'EMPRUNTÉ'}
                            </div>
                          </div>
                          
                          {/* Genre élégant */}
                          <div className="absolute bottom-6 left-6 z-30">
                            <div className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/20">
                              <span className="text-white text-xs font-medium tracking-wide uppercase">
                                {book.genre}
                              </span>
                            </div>
                          </div>

                          {/* Effet shine */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 transform -skew-x-12 translate-x-full group-hover:-translate-x-full z-25"></div>
                        </div>

                        {/* Contenu sophistiqué */}
                        <CardContent className="p-6 bg-gradient-to-br from-white to-gray-50/50">
                          <div className="space-y-3">
                            <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-black transition-colors line-clamp-2">
                              {book.title}
                            </h3>
                            
                            <div className="flex items-center text-gray-600">
                              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                                <Users className="w-3 h-3" />
                              </div>
                              <span className="text-sm font-medium">{book.author}</span>
                            </div>
                            
                            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                              {book.description || `Une œuvre remarquable publiée en ${book.publication_year}, faisant partie de notre collection ${book.genre} d'exception.`}
                            </p>
                            
                            {/* Métadonnées élégantes */}
                            <div className="flex items-center justify-between py-3 border-t border-gray-100">
                              <div className="text-xs text-gray-500">
                                <div>ISBN: {book.isbn}</div>
                                <div>Année: {book.publication_year}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-semibold text-gray-900">
                                  {book.available_quantity}/{book.total_quantity}
                                </div>
                                <div className="text-xs text-gray-500">exemplaires</div>
                              </div>
                            </div>
                            
                            {/* Barre de progression stylée */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>Disponibilité</span>
                                <span>{Math.round((book.available_quantity / book.total_quantity) * 100)}%</span>
                              </div>
                              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div 
                                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(book.available_quantity / book.total_quantity) * 100}%` }}
                                  transition={{ duration: 1, delay: index * 0.2 }}
                                />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Indicateurs mobiles élégants */}
          {isMobile && books.length > 1 && (
            <div className="flex justify-center mt-12 space-x-3">
              {books.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-gray-900 w-8' 
                      : 'bg-gray-300 w-3 hover:bg-gray-400'
                  }`}
                  aria-label={`Aller au livre ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Bouton d'action premium */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Link 
            to="/catalogue" 
            onClick={() => window.scrollTo(0, 0)}
            className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white font-semibold rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden transform hover:scale-105"
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
          >
            {/* Effet shine animé */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
            
            <span className="relative z-10 mr-3">Explorer le Catalogue Complet</span>
            <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
          
          <p className="mt-4 text-gray-500 text-sm">
            Plus de {books.length * 10}+ ouvrages disponibles
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
