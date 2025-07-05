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
      className="bg-gray-50 py-16 md:py-24 w-full overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* En-tête */}
        <motion.div 
          className="text-center mb-12 md:mb-16 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block mb-3 px-4 py-2 bg-black text-white rounded-full text-sm font-medium">
            Collection E-Library 2iE
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Découvrez Notre Collection
          </h2>
          <p className="text-gray-600 text-lg">
            Explorez notre catalogue de livres soigneusement sélectionnés pour la communauté académique 2iE
          </p>
        </motion.div>

        {/* Carrousel */}
        <div 
          className="relative" 
          onMouseEnter={() => setIsHovering(true)} 
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Contrôles de navigation */}
          {!isMobile && books.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white hover:bg-gray-100 rounded-full shadow-lg border border-gray-200 flex items-center justify-center transition-all duration-200 hover:scale-105"
                aria-label="Livre précédent"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white hover:bg-gray-100 rounded-full shadow-lg border border-gray-200 flex items-center justify-center transition-all duration-200 hover:scale-105"
                aria-label="Livre suivant"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </>
          )}

          {/* Grille de livres */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 md:px-16">
            <AnimatePresence mode="wait">
              {getVisibleBooks().map((book, index) => (
                <motion.div
                  key={`${book.id}-${currentIndex}-${index}`}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <Card className="overflow-hidden bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                    {/* Image du livre */}
                    <div className="relative h-80 overflow-hidden">
                      <img
                        src={getBookImage(book)}
                        alt={book.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Badge de disponibilité */}
                      <div className="absolute top-4 right-4">
                        <Badge 
                          variant={book.available_quantity > 0 ? "default" : "destructive"}
                          className={`${book.available_quantity > 0 ? "bg-green-600" : "bg-red-600"} text-white rounded-full px-3 py-1 text-xs font-medium`}
                        >
                          {book.available_quantity > 0 ? 'Disponible' : 'Emprunté'}
                        </Badge>
                      </div>
                      
                      {/* Genre */}
                      <div className="absolute bottom-4 left-4">
                        <Badge 
                          variant="secondary" 
                          className="bg-black/80 text-white font-medium rounded-full px-3 py-1 text-xs"
                        >
                          {book.genre}
                        </Badge>
                      </div>
                    </div>

                    {/* Contenu */}
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-black transition-colors">
                        {book.title}
                      </h3>
                      
                      <div className="flex items-center text-gray-600 mb-3">
                        <Users className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">{book.author}</span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {book.description || `Publié en ${book.publication_year}, ce livre fait partie de notre collection ${book.genre}.`}
                      </p>
                      
                      {/* Métadonnées */}
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <span>ISBN: {book.isbn}</span>
                        <span>{book.publication_year}</span>
                      </div>
                      
                      {/* Quantité disponible */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {book.available_quantity}/{book.total_quantity} disponible(s)
                        </span>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${(book.available_quantity / book.total_quantity) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Indicateurs (mobile uniquement) */}
          {isMobile && books.length > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {books.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentIndex ? 'bg-black w-6' : 'bg-gray-300'
                  }`}
                  aria-label={`Aller au livre ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Bouton d'action */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link 
            to="/catalogue" 
            onClick={() => window.scrollTo(0, 0)}
            className="inline-flex items-center px-8 py-4 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-all duration-200 group shadow-lg hover:shadow-xl"
          >
            Voir Tout le Catalogue
            <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
