'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, Filter, Book, User, Calendar, ArrowRight, X, ChevronDown, SlidersHorizontal, Star, Heart, Eye, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Dialog } from '@/components/ui/dialog'

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
  cover_image?: string // Champ pour l'image de couverture uploadée
}

const Catalogue = () => {
  const [books, setBooks] = useState<Book[]>([])
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [selectedAuthor, setSelectedAuthor] = useState('all')
  const [sortBy, setSortBy] = useState('title')
  const [loading, setLoading] = useState(true)
  const [genres, setGenres] = useState<string[]>([])
  const [authors, setAuthors] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [showBorrowModal, setShowBorrowModal] = useState(false)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [borrowLoading, setBorrowLoading] = useState(false)
  const [borrowError, setBorrowError] = useState('')
  const [borrowSuccess, setBorrowSuccess] = useState('')
  const [borrowStartDate, setBorrowStartDate] = useState<string>('')
  const [borrowEndDate, setBorrowEndDate] = useState<string>('')
  const [comments, setComments] = useState<string>('')

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

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true)
      let url = 'http://localhost:5000/api/books?'
      if (searchTerm) url += `search=${encodeURIComponent(searchTerm)}&`
      if (selectedGenre !== 'all') url += `genre=${encodeURIComponent(selectedGenre)}&`
      if (selectedAuthor !== 'all') url += `author=${encodeURIComponent(selectedAuthor)}&`
      // Optionnel : ajouter le tri côté backend si supporté
      // if (sortBy) url += `sortBy=${encodeURIComponent(sortBy)}&`
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        const booksArray = Array.isArray(data?.data?.books) ? data.data.books : []
        setBooks(booksArray)
        setFilteredBooks(booksArray)
      } else {
        setBooks([])
        setFilteredBooks([])
        console.error('Erreur lors de la récupération des livres')
      }
    } catch (error) {
      setBooks([])
      setFilteredBooks([])
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }, [searchTerm, selectedGenre, selectedAuthor])

  // Récupération des livres depuis l'API
  useEffect(() => {
    fetchBooks()
  }, [fetchBooks])

  useEffect(() => {
    fetchGenres()
    fetchAuthors()
  }, [])

  const fetchGenres = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/books/genres')
      if (response.ok) {
        const data = await response.json()
        let genresArr = []
        if (data?.data?.genres && Array.isArray(data.data.genres)) {
          genresArr = data.data.genres
        } else if (data?.genres && Array.isArray(data.genres)) {
          genresArr = data.genres
        } else if (Array.isArray(data?.data)) {
          genresArr = data.data
        } else if (Array.isArray(data)) {
          genresArr = data
        }
        // Sanitize: extract string value, deduplicate, filter empty
        const genreStrings = genresArr
          .map((g: unknown) => {
            if (typeof g === 'string') return g
            if (isGenreObj(g)) return g.genre
            if (isNameObj(g)) return g.name
            return ''
          })
          .map((g: string) => g.trim())
          .filter((g: string) => !!g)
        const uniqueGenres = Array.from(new Set(genreStrings))
        setGenres(uniqueGenres)
      }
    } catch (error) {
      setGenres([
        'Technologie', 'Histoire', 'Sciences', 'Littérature', 'Ingénierie',
        'Économie', 'Informatique', 'Environnement', 'Sociologie', 'Marketing'
      ])
    }
  }

  const fetchAuthors = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/books/popular-authors')
      if (response.ok) {
        const data = await response.json()
        let authorsArr = []
        if (data?.data?.authors && Array.isArray(data.data.authors)) {
          authorsArr = data.data.authors
        } else if (data?.authors && Array.isArray(data.authors)) {
          authorsArr = data.authors
        } else if (Array.isArray(data?.data)) {
          authorsArr = data.data
        } else if (Array.isArray(data)) {
          authorsArr = data
        }
        // Sanitize: extract string value, deduplicate, filter empty
        const authorStrings = authorsArr
          .map((a: unknown) => {
            if (typeof a === 'string') return a
            if (isAuthorObj(a)) return a.author
            if (isNameObj(a)) return a.name
            return ''
          })
          .map((a: string) => a.trim())
          .filter((a: string) => !!a)
        const uniqueAuthors = Array.from(new Set(authorStrings))
        setAuthors(uniqueAuthors)
      }
    } catch (error) {
      setAuthors([
        'Dr. Marie Dubois', 'Prof. Amadou Diallo', 'Prof. Jean-Claude Koné',
        'Dr. Fatima Traoré', 'Ing. Pierre Ouédraogo', 'Dr. Awa Ndiaye',
        'Dr. Sarah Johnson', 'Prof. Michel Sawadogo'
      ])
    }
  }

  // Rafraîchir genres/auteurs à chaque ouverture du panneau de filtres
  useEffect(() => {
    if (showFilters) {
      fetchGenres()
      fetchAuthors()
    }
  }, [showFilters])

  const resetFilters = () => {
    setSearchInput('')
    setSearchTerm('')
    setSelectedGenre('all')
    setSelectedAuthor('all')
    setSortBy('title')
  }

  const getBookImage = (book: Book) => {
    console.log('getBookImage pour livre:', book.title, 'cover_image:', book.cover_image)
    
    // Priorité 1: Image réelle uploadée lors de l'ajout du livre
    if (book.cover_image) {
      console.log('Image trouvée pour', book.title, ':', book.cover_image)
      // Si c'est un chemin relatif, construire l'URL complète vers le serveur
      if (book.cover_image.startsWith('/uploads/') || book.cover_image.startsWith('uploads/')) {
        const imageUrl = `http://localhost:5000/${book.cover_image.startsWith('/') ? book.cover_image.slice(1) : book.cover_image}`
        console.log('URL image construite:', imageUrl)
        return imageUrl
      }
      // Si c'est déjà une URL complète
      if (book.cover_image.startsWith('http')) {
        console.log('URL image complète:', book.cover_image)
        return book.cover_image
      }
      // Sinon, construire l'URL
      const imageUrl = `http://localhost:5000/uploads/${book.cover_image}`
      console.log('URL image construite (fallback):', imageUrl)
      return imageUrl
    }

    console.log('Pas d\'image pour', book.title, ', utilisation des images par défaut')

    // Priorité 2: Images spécifiques par livre (pour les anciens livres)
    const bookImages: { [key: number]: string } = {
      1: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&h=400&fit=crop', // IA
      2: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop', // Histoire Afrique
      3: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=300&h=400&fit=crop', // Mathématiques
      4: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop', // Littérature
      5: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=300&h=400&fit=crop', // Génie Civil
      6: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=300&h=400&fit=crop', // Économie
      7: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=400&fit=crop', // Programmation
      8: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=300&h=400&fit=crop', // Énergies renouvelables
      9: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=300&h=400&fit=crop', // Chimie
      10: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=400&fit=crop', // Sociologie urbaine
      11: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=300&h=400&fit=crop', // Mécanique des fluides
      12: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=400&fit=crop'  // Marketing digital
    }

    // Priorité 3: Images par genre comme fallback
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
    }

    const fallbackUrl = bookImages[book.id] || genreImages[book.genre] || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop'
    console.log('URL fallback utilisée:', fallbackUrl)
    return fallbackUrl
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navbar />
      
      {/* Hero Section - Plus moderne et épuré */}
      <div className="relative bg-gradient-to-r from-gray-900 via-black to-gray-900 h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=800&fit=crop" 
            alt="Bibliothèque" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90"></div>
        </div>
        
        <motion.div 
          className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-block mb-6 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
          >
            <span className="text-sm font-medium tracking-wide">CATALOGUE NUMÉRIQUE</span>
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-light mb-8 tracking-tight">
            Découvrez Notre
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              Collection
            </span>
          </h1>
          <div className="w-24 h-0.5 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-8"></div>
          <p className="text-xl font-light max-w-3xl mx-auto opacity-90 leading-relaxed">
            Explorez notre collection de <span className="font-semibold text-blue-400">{books.length}</span> ouvrages soigneusement sélectionnés pour votre réussite académique et votre épanouissement personnel
          </p>
          
          {/* Statistiques en temps réel */}
          <motion.div 
            className="flex flex-wrap justify-center gap-8 mt-12"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">{books.length}</div>
              <div className="text-sm text-gray-300 uppercase tracking-wide">Livres</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400">{books.reduce((sum, book) => sum + book.available_quantity, 0)}</div>
              <div className="text-sm text-gray-300 uppercase tracking-wide">Disponibles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">{new Set(books.map(book => book.genre)).size}</div>
              <div className="text-sm text-gray-300 uppercase tracking-wide">Genres</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 py-20">
        {/* Barre de recherche moderne */}
        <motion.div 
          className="mb-16"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <div className="max-w-4xl mx-auto">
            {/* Recherche principale avec design moderne */}
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                <Input
                  type="text"
                  placeholder="Rechercher par titre, auteur, ISBN ou mot-clé..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') setSearchTerm(searchInput)
                  }}
                  className="pl-14 pr-24 py-6 text-lg border-0 bg-transparent focus:ring-0 rounded-2xl placeholder:text-gray-400"
                />
                <Button
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white border-0 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                  onClick={() => setSearchTerm(searchInput)}
                >
                  Rechercher
                </Button>
              </div>
            </div>

            {/* Barre de filtres moderne */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
              <div className="flex items-center gap-4 flex-wrap">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 bg-white/80 border-gray-300 hover:bg-gray-50 rounded-xl px-4 py-2.5 font-medium transition-all duration-300"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filtres avancés
                  <motion.div
                    animate={{ rotate: showFilters ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </Button>
                
                <AnimatePresence>
                  {(selectedGenre !== 'all' || selectedAuthor !== 'all' || searchTerm) && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button
                        variant="ghost"
                        onClick={resetFilters}
                        className="text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl px-3 py-2 transition-all duration-300"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Réinitialiser
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 font-medium">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-emerald-100 text-gray-700">
                    <Eye className="w-4 h-4 mr-1" />
                    {Array.isArray(filteredBooks) ? filteredBooks.length : 0} résultat(s)
                  </span>
                </span>
              </div>
            </div>

            {/* Panneau de filtres moderne */}
            <AnimatePresence>
              {showFilters && (
                <motion.div 
                  className="mt-8 p-8 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-xl"
                  initial={{ height: 0, opacity: 0, y: -20 }}
                  animate={{ height: "auto", opacity: 1, y: 0 }}
                  exit={{ height: 0, opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Genre</label>
                      <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                        <SelectTrigger className="bg-white border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all">
                          <SelectValue placeholder="Tous les genres" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200 rounded-xl shadow-xl">
                          <SelectItem value="all" className="rounded-lg">Tous les genres</SelectItem>
                          {genres.map((genre) => (
                            <SelectItem key={genre} value={genre} className="rounded-lg">{genre}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Auteur</label>
                      <Select value={selectedAuthor} onValueChange={setSelectedAuthor}>
                        <SelectTrigger className="bg-white border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 transition-all">
                          <SelectValue placeholder="Tous les auteurs" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200 rounded-xl shadow-xl">
                          <SelectItem value="all" className="rounded-lg">Tous les auteurs</SelectItem>
                          {authors.map((author) => (
                            <SelectItem key={author} value={author} className="rounded-lg">{author}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Trier par</label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="bg-white border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500/20 transition-all">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200 rounded-xl shadow-xl">
                          <SelectItem value="title" className="rounded-lg">Titre A-Z</SelectItem>
                          <SelectItem value="author" className="rounded-lg">Auteur A-Z</SelectItem>
                          <SelectItem value="year" className="rounded-lg">Année (récent)</SelectItem>
                          <SelectItem value="availability" className="rounded-lg">Disponibilité</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </motion.div>
              )}
          </div>
        </motion.div>

        {/* Grille des livres moderne */}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trier par
                    </label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="border-gray-200 focus:border-black rounded-lg">
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
        {Array.isArray(filteredBooks) && filteredBooks.length === 0 ? (
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
          Array.isArray(filteredBooks) ? (
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredBooks.map((book) => (
                <motion.div
                  key={book.id}
                  variants={itemVariants}
                  className="group bg-white border border-gray-200 hover:shadow-2xl transition-all duration-500 overflow-hidden rounded-xl"
                >
                  {/* Image - Format portrait comme un vrai livre */}
                  <div className="relative h-72 overflow-hidden rounded-t-xl">
                    <img
                      src={getBookImage(book)}
                      alt={book.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Badge de disponibilité seulement */}
                    <div className="absolute top-3 right-3">
                      <Badge 
                        variant={book.available_quantity > 0 ? "default" : "destructive"}
                        className={`${book.available_quantity > 0 ? "bg-green-600" : "bg-red-600"} rounded-full px-2 py-1 text-xs`}
                      >
                        {book.available_quantity > 0 ? "●" : "●"}
                      </Badge>
                    </div>
                    
                    {/* Genre en bas de l'image */}
                    <div className="absolute bottom-3 left-3">
                      <Badge 
                        variant="secondary" 
                        className="bg-black/80 text-white font-medium rounded-full px-2 py-1 text-xs"
                      >
                        {book.genre}
                      </Badge>
                    </div>
                  </div>

                  {/* Contenu - Plus compact */}
                  <div className="p-4">
                    <h3 className="text-base font-medium text-gray-900 mb-2 group-hover:text-black transition-colors line-clamp-2">
                      {book.title}
                    </h3>
                    
                    <div className="text-gray-600 mb-2">
                      <span className="text-sm line-clamp-1">{book.author}</span>
                    </div>
                    
                    <div className="text-gray-500 mb-3">
                      <span className="text-xs">{book.publication_year}</span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-gray-500">
                        {book.available_quantity}/{book.total_quantity} dispo.
                      </span>
                      <span className="text-xs text-gray-400">
                        {book.isbn.slice(-4)}
                      </span>
                    </div>

                    {/* Actions - Plus compactes */}
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1 border-gray-200 hover:border-black hover:bg-black hover:text-white transition-all rounded-lg text-xs"
                        onClick={() => window.location.href = `/livre/${book.id}`}
                      >
                        Voir
                      </Button>
                      <Button 
                        size="sm"
                        className="flex-1 bg-black hover:bg-gray-800 text-white rounded-lg text-xs"
                        disabled={book.available_quantity === 0}
                        onClick={() => {
                          if (book.available_quantity > 0) {
                            setSelectedBook(book)
                            setShowBorrowModal(true)
                            setBorrowError('')
                            setBorrowSuccess('')
                            // Init dates
                            const today = new Date()
                            const todayStr = today.toISOString().split('T')[0]
                            setBorrowStartDate(todayStr)
                            // Par défaut, retour = aujourd'hui + 7 jours
                            const end = new Date(today)
                            end.setDate(end.getDate() + 7)
                            setBorrowEndDate(end.toISOString().split('T')[0])
                            setComments('')
                          }
                        }}
                      >
                        Emprunter
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : null
        )}
      </div>
      
      <Footer />

      {/* Modale d'emprunt */}
      <Dialog open={showBorrowModal} onOpenChange={setShowBorrowModal}>
        {selectedBook && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-black" onClick={() => {
                setShowBorrowModal(false)
                setSelectedBook(null)
                setBorrowError('')
                setBorrowSuccess('')
                setBorrowStartDate('')
                setBorrowEndDate('')
                setComments('')
              }}>
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-semibold mb-4">Emprunter ce livre</h2>
              <div className="mb-4">
                <div className="font-medium text-lg mb-1">{selectedBook.title}</div>
                <div className="text-gray-600 mb-1">Auteur : {selectedBook.author}</div>
                <div className="text-gray-500 text-sm">Genre : {selectedBook.genre}</div>
              </div>
              {/* Ici, on peut ajouter d'autres champs si besoin (date de retour, etc.) */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
                <input
                  type="date"
                  className="border rounded px-2 py-1 w-full"
                  value={borrowStartDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setBorrowStartDate(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de retour souhaitée <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  className="border rounded px-2 py-1 w-full"
                  value={borrowEndDate}
                  min={borrowStartDate || new Date().toISOString().split('T')[0]}
                  onChange={e => setBorrowEndDate(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Commentaire (optionnel)</label>
                <textarea
                  className="border rounded px-2 py-1 w-full"
                  value={comments}
                  onChange={e => setComments(e.target.value)}
                  rows={2}
                  placeholder="Motif, précision, etc."
                />
              </div>
              {borrowError && <div className="text-red-600 mb-2">{borrowError}</div>}
              {borrowSuccess && <div className="text-green-600 mb-2">{borrowSuccess}</div>}
              <Button
                className="w-full bg-black text-white mt-2"
                disabled={borrowLoading}
                onClick={async () => {
                  setBorrowLoading(true)
                  setBorrowError('')
                  setBorrowSuccess('')
                  if (!borrowEndDate) {
                    setBorrowError('Veuillez choisir une date de retour.')
                    setBorrowLoading(false)
                    return
                  }
                  try {
                    const token = localStorage.getItem('token')
                    if (!token) {
                      setBorrowError('Vous devez être connecté pour emprunter.')
                      setBorrowLoading(false)
                      return
                    }
                    const body = {
                      book_id: selectedBook.id,
                      start_date: borrowStartDate,
                      due_date: borrowEndDate,
                      comment_text: comments || ''
                    }
                    console.log('POST /api/borrowings body:', body)
                    const res = await fetch('http://localhost:5000/api/borrowings', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                      },
                      body: JSON.stringify(body)
                    })
                    const data = await res.json()
                    if (!res.ok || !data.success) {
                      // Affiche tout le contenu de la réponse d'erreur
                      console.error('Erreur backend:', JSON.stringify(data))
                      // Affiche le message d'erreur le plus explicite possible dans l'UI
                      setBorrowError(data.message || data.error || data.detail || JSON.stringify(data) || 'Erreur lors de l\'emprunt')
                      throw new Error(data.message || data.error || data.detail || 'Erreur lors de l\'emprunt')
                    }
                    setBorrowSuccess('Emprunt enregistré !')
                    setTimeout(() => setShowBorrowModal(false), 1200)
                    fetchBooks() // refresh catalogue
                  } catch (e) {
                    setBorrowError(e instanceof Error ? e.message : 'Erreur lors de l\'emprunt')
                  } finally {
                    setBorrowLoading(false)
                  }
                }}
              >
                {borrowLoading ? 'Emprunt en cours...' : 'Confirmer l\'emprunt'}
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  )
}

// Type guards for genre and author objects
function isGenreObj(obj: unknown): obj is { genre: string } {
  return typeof obj === 'object' && obj !== null && 'genre' in obj && typeof (obj as { genre: unknown }).genre === 'string'
}
function isNameObj(obj: unknown): obj is { name: string } {
  return typeof obj === 'object' && obj !== null && 'name' in obj && typeof (obj as { name: unknown }).name === 'string'
}
function isAuthorObj(obj: unknown): obj is { author: string } {
  return typeof obj === 'object' && obj !== null && 'author' in obj && typeof (obj as { author: unknown }).author === 'string'
}

export default Catalogue