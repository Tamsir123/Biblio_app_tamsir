'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Book, User, Calendar, ArrowRight, X, ChevronDown, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface Book {
  id: number
  title: string
  author: string
  isbn: string
  genre: string
  description: string
  total_quantity: number
  available_quantity: number
  publication_year: number
  created_at: string
}

const Catalogue = () => {
  const [books, setBooks] = useState<Book[]>([])
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [selectedAuthor, setSelectedAuthor] = useState('all')
  const [sortBy, setSortBy] = useState('title')
  const [loading, setLoading] = useState(true)
  const [genres, setGenres] = useState<string[]>([])
  const [authors, setAuthors] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 }
    }
  }

  // Récupération des livres depuis l'API
  useEffect(() => {
    fetchBooks()
    fetchGenres()
    fetchAuthors()
  }, [])

  const fetchBooks = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:5000/api/books')
      if (response.ok) {
        const data = await response.json()
        setBooks(data.books || data)
        setFilteredBooks(data.books || data)
      } else {
        console.error('Erreur lors de la récupération des livres')
      }
    } catch (error) {
      console.error('Erreur:', error)
      // Données de test si l'API n'est pas disponible
      const testBooks = [
        {
          id: 1,
          title: "Introduction à l'Intelligence Artificielle",
          author: "Dr. Marie Dubois",
          isbn: "978-2-123456-78-9",
          genre: "Technologie",
          description: "Une introduction complète aux concepts fondamentaux de l'IA moderne.",
          total_quantity: 5,
          available_quantity: 3,
          publication_year: 2023,
          created_at: "2024-01-01"
        },
        {
          id: 2,
          title: "Histoire de l'Afrique Contemporaine",
          author: "Prof. Amadou Diallo",
          isbn: "978-2-987654-32-1",
          genre: "Histoire",
          description: "Un regard approfondi sur l'évolution de l'Afrique au XXe siècle.",
          total_quantity: 3,
          available_quantity: 0,
          publication_year: 2022,
          created_at: "2024-01-01"
        },
        {
          id: 3,
          title: "Mathématiques Appliquées à l'Ingénierie",
          author: "Prof. Jean-Claude Koné",
          isbn: "978-2-456789-12-3",
          genre: "Sciences",
          description: "Manuel complet de mathématiques pour les étudiants en ingénierie.",
          total_quantity: 8,
          available_quantity: 5,
          publication_year: 2023,
          created_at: "2024-01-01"
        },
        {
          id: 4,
          title: "Littérature Africaine Contemporaine",
          author: "Dr. Fatima Traoré",
          isbn: "978-2-789012-34-5",
          genre: "Littérature",
          description: "Une exploration de la richesse littéraire africaine moderne.",
          total_quantity: 4,
          available_quantity: 2,
          publication_year: 2022,
          created_at: "2024-01-01"
        }
      ]
      setBooks(testBooks)
      setFilteredBooks(testBooks)
    } finally {
      setLoading(false)
    }
  }

  const fetchGenres = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/books/genres')
      if (response.ok) {
        const data = await response.json()
        setGenres(data.genres || [])
      }
    } catch (error) {
      setGenres(['Technologie', 'Histoire', 'Sciences', 'Littérature', 'Fiction'])
    }
  }

  const fetchAuthors = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/books/popular-authors')
      if (response.ok) {
        const data = await response.json()
        setAuthors(data.authors || [])
      }
    } catch (error) {
      setAuthors(['Dr. Marie Dubois', 'Prof. Amadou Diallo', 'Prof. Jean-Claude Koné', 'Dr. Fatima Traoré'])
    }
  }

  // Recherche et filtrage
  useEffect(() => {
    let filtered = books

    if (searchTerm) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.isbn.includes(searchTerm)
      )
    }

    if (selectedGenre !== 'all') {
      filtered = filtered.filter(book => book.genre === selectedGenre)
    }

    if (selectedAuthor !== 'all') {
      filtered = filtered.filter(book => book.author === selectedAuthor)
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'author':
          return a.author.localeCompare(b.author)
        case 'year':
          return b.publication_year - a.publication_year
        case 'availability':
          return b.available_quantity - a.available_quantity
        default:
          return 0
      }
    })

    setFilteredBooks(filtered)
  }, [books, searchTerm, selectedGenre, selectedAuthor, sortBy])

  const resetFilters = () => {
    setSearchTerm('')
    setSelectedGenre('all')
    setSelectedAuthor('all')
    setSortBy('title')
  }

  const getBookImage = (book: Book) => {
    const genreImages: { [key: string]: string } = {
      'Technologie': 'https://images.unsplash.com/photo-1518709268805-4e9042af2ea0?w=600&h=400&fit=crop',
      'Histoire': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop',
      'Sciences': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop',
      'Littérature': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=400&fit=crop',
      'Fiction': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=400&fit=crop'
    }
    return genreImages[book.genre] || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&h=400&fit=crop'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-black mx-auto mb-8"></div>
            <p className="text-xl text-gray-600">Chargement du catalogue...</p>
          </motion.div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-black h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=800&fit=crop" 
            alt="Bibliothèque" 
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
          <h1 className="text-5xl md:text-6xl font-light mb-6">Catalogue</h1>
          <div className="w-20 h-0.5 bg-white mx-auto mb-6"></div>
          <p className="text-xl font-light max-w-2xl mx-auto opacity-90">
            Explorez notre collection de {books.length} ouvrages soigneusement sélectionnés
          </p>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Barre de recherche et filtres */}
        <motion.div 
          className="mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="max-w-4xl mx-auto">
            {/* Recherche principale */}
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <Input
                type="text"
                placeholder="Rechercher par titre, auteur ou ISBN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg border-2 border-gray-200 focus:border-black rounded-none bg-gray-50 focus:bg-white transition-all"
              />
            </div>

            {/* Barre de filtres */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 border-2 border-gray-200 hover:border-black rounded-none"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filtres
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </Button>
                
                {(selectedGenre !== 'all' || selectedAuthor !== 'all' || searchTerm) && (
                  <Button
                    variant="ghost"
                    onClick={resetFilters}
                    className="text-gray-600 hover:text-black"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Réinitialiser
                  </Button>
                )}
              </div>

              <div className="text-sm text-gray-600">
                <span className="font-medium">{filteredBooks.length}</span> livre(s) trouvé(s)
              </div>
            </div>

            {/* Panneau de filtres */}
            {showFilters && (
              <motion.div 
                className="mt-6 p-6 bg-gray-50 border border-gray-200"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Genre
                    </label>
                    <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                      <SelectTrigger className="border-gray-200 focus:border-black rounded-none">
                        <SelectValue placeholder="Tous les genres" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les genres</SelectItem>
                        {genres.map((genre) => (
                          <SelectItem key={genre} value={genre}>
                            {genre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Auteur
                    </label>
                    <Select value={selectedAuthor} onValueChange={setSelectedAuthor}>
                      <SelectTrigger className="border-gray-200 focus:border-black rounded-none">
                        <SelectValue placeholder="Tous les auteurs" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les auteurs</SelectItem>
                        {authors.map((author) => (
                          <SelectItem key={author} value={author}>
                            {author}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trier par
                    </label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="border-gray-200 focus:border-black rounded-none">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="title">Titre A-Z</SelectItem>
                        <SelectItem value="author">Auteur A-Z</SelectItem>
                        <SelectItem value="year">Année (récent)</SelectItem>
                        <SelectItem value="availability">Disponibilité</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Grille des livres */}
        {filteredBooks.length === 0 ? (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Book className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-light text-gray-900 mb-4">Aucun livre trouvé</h3>
            <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredBooks.map((book) => (
              <motion.div
                key={book.id}
                variants={itemVariants}
                className="group bg-white border border-gray-200 hover:shadow-2xl transition-all duration-500 overflow-hidden"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={getBookImage(book)}
                    alt={book.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4">
                    <Badge 
                      variant="secondary" 
                      className="bg-white/90 text-black font-medium"
                    >
                      {book.genre}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge 
                      variant={book.available_quantity > 0 ? "default" : "destructive"}
                      className={book.available_quantity > 0 ? "bg-green-600" : "bg-red-600"}
                    >
                      {book.available_quantity > 0 ? "Disponible" : "Indisponible"}
                    </Badge>
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-6">
                  <h3 className="text-xl font-medium text-gray-900 mb-3 group-hover:text-black transition-colors">
                    {book.title}
                  </h3>
                  
                  <div className="flex items-center text-gray-600 mb-2">
                    <User className="w-4 h-4 mr-2" />
                    <span className="text-sm">{book.author}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-4">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm">{book.publication_year}</span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-6 line-clamp-3">
                    {book.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-sm text-gray-500">
                      {book.available_quantity}/{book.total_quantity} exemplaire(s)
                    </span>
                    <span className="text-xs text-gray-400">
                      ISBN: {book.isbn}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      className="flex-1 border-gray-200 hover:border-black hover:bg-black hover:text-white transition-all rounded-none"
                    >
                      Détails
                    </Button>
                    <Button 
                      className="flex-1 bg-black hover:bg-gray-800 text-white rounded-none"
                      disabled={book.available_quantity === 0}
                    >
                      Emprunter
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
      
      <Footer />
    </div>
  )
}

export default Catalogue
