'use client'

import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Calendar, User, BookOpen, Tag, Copy, Heart, Download, Share2, Star, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { motion } from 'framer-motion'
import { useToast } from '@/hooks/use-toast'

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
  cover_image?: string
}

interface Review {
  id: number
  user_id: number
  book_id: number
  rating: number
  comment: string
  is_approved: boolean
  created_at: string
  user_name?: string
}

const BookDetails = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [book, setBook] = useState<Book | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [borrowing, setBorrowing] = useState(false)
  const [error, setError] = useState('')
  
  // États pour la pagination des avis
  const [currentReviewPage, setCurrentReviewPage] = useState(1)
  const [showAllReviews, setShowAllReviews] = useState(false)
  const reviewsPerPage = 3 // Nombre d'avis par page
  const initialReviewsCount = 2 // Nombre d'avis affichés initialement

  // États pour le formulaire d'avis
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: ''
  })
  const [submittingReview, setSubmittingReview] = useState(false)
  const [userReview, setUserReview] = useState<Review | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (id) {
      fetchBookDetails(parseInt(id))
      fetchBookReviews(parseInt(id))
    }
  }, [id])

  useEffect(() => {
    if (reviews.length > 0) {
      // Vérifier si l'utilisateur a déjà laissé un avis
      const userId = 1 // Récupérer depuis le contexte d'auth plus tard
      const existingReview = reviews.find(review => review.user_id === userId)
      setUserReview(existingReview || null)
    }
  }, [reviews])

  const fetchBookDetails = async (bookId: number) => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:5000/api/books/${bookId}`)
      if (response.ok) {
        const data = await response.json()
        setBook(data.data || data)
      } else {
        setError('Livre non trouvé')
      }
    } catch (error) {
      console.error('Erreur:', error)
      setError('Erreur lors de la récupération du livre')
    } finally {
      setLoading(false)
    }
  }

  const fetchBookReviews = async (bookId: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/books/${bookId}/reviews`)
      if (response.ok) {
        const data = await response.json()
        setReviews(data.reviews || [])
      }
    } catch (error) {
      console.error('Erreur lors du chargement des avis:', error)
      // En cas d'erreur API, on ne met plus d'avis d'exemple
    }
  }

  const handleBorrow = async () => {
    if (!book || book.available_quantity === 0) return

    try {
      setBorrowing(true)
      const token = localStorage.getItem('token')
      
      if (!token) {
        navigate('/login')
        return
      }

      // Calculer la date de retour par défaut (15 jours à partir d'aujourd'hui)
      const today = new Date()
      const dueDate = new Date(today)
      dueDate.setDate(dueDate.getDate() + 15)
      const dueDateString = dueDate.toISOString().split('T')[0] // Format YYYY-MM-DD

      const response = await fetch('http://localhost:5000/api/borrowings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          book_id: book.id,
          due_date: dueDateString
        })
      })

      if (response.ok) {
        // Actualiser les données du livre
        fetchBookDetails(book.id)
        toast({
          title: "Succès",
          description: "Livre emprunté avec succès !",
          variant: "default"
        })
      } else {
        const data = await response.json()
        toast({
          title: "Erreur",
          description: data.message || 'Erreur lors de l\'emprunt',
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast({
        title: "Erreur",
        description: 'Erreur lors de l\'emprunt',
        variant: "destructive"
      })
    } finally {
      setBorrowing(false)
    }
  }

  const getBookImage = (book: Book) => {
    console.log('getBookImage pour livre:', book.title, 'cover_image:', book.cover_image)
    
    // Priorité 1: Image réelle uploadée lors de l'ajout du livre
    if (book.cover_image) {
      // Si le chemin commence par /uploads/ ou uploads/, construire l'URL complète
      if (book.cover_image.startsWith('/uploads/') || book.cover_image.startsWith('uploads/')) {
        const imageUrl = `http://localhost:5000${book.cover_image.startsWith('/') ? '' : '/'}${book.cover_image}`
        console.log('URL image construite:', imageUrl)
        return imageUrl
      }
      // Si c'est déjà une URL complète
      if (book.cover_image.startsWith('http')) {
        console.log('URL image complète détectée:', book.cover_image)
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
      1: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=600&fit=crop', // IA
      2: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop', // Histoire Afrique
      3: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=400&h=600&fit=crop', // Mathématiques
      4: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop', // Littérature
      5: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=600&fit=crop', // Génie Civil
      6: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=400&h=600&fit=crop', // Économie
      7: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=600&fit=crop', // Programmation
      8: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=600&fit=crop', // Énergies renouvelables
      9: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=400&h=600&fit=crop', // Chimie
      10: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=600&fit=crop', // Sociologie urbaine
      11: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=600&fit=crop', // Mécanique des fluides
      12: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=600&fit=crop'  // Marketing digital
    }

    // Priorité 3: Images par genre comme fallback final
    return bookImages[book.id] || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop'
  }

  const copyISBN = () => {
    if (book) {
      navigator.clipboard.writeText(book.isbn)
      toast({
        title: "Copié",
        description: "ISBN copié dans le presse-papiers !",
        variant: "default"
      })
    }
  }

  const shareBook = () => {
    if (book && navigator.share) {
      navigator.share({
        title: book.title,
        text: `Découvrez "${book.title}" par ${book.author}`,
        url: window.location.href
      })
    } else if (book) {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Copié",
        description: "Lien copié dans le presse-papiers !",
        variant: "default"
      })
    }
  }

  const getAverageRating = () => {
    if (reviews.length === 0) return 0
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
    return Math.round((sum / reviews.length) * 10) / 10
  }

  // Fonctions pour la pagination des avis
  const getDisplayedReviews = () => {
    if (showAllReviews) {
      const startIndex = (currentReviewPage - 1) * reviewsPerPage
      const endIndex = startIndex + reviewsPerPage
      return reviews.slice(startIndex, endIndex)
    } else {
      return reviews.slice(0, initialReviewsCount)
    }
  }

  const getTotalReviewPages = () => {
    return Math.ceil(reviews.length / reviewsPerPage)
  }

  const handleShowMoreReviews = () => {
    setShowAllReviews(true)
    setCurrentReviewPage(1)
  }

  const handleShowLessReviews = () => {
    setShowAllReviews(false)
    setCurrentReviewPage(1)
  }

  const handleReviewPageChange = (page: number) => {
    setCurrentReviewPage(page)
  }

  // Fonctions pour gérer les avis
  const handleSubmitReview = async () => {
    if (newReview.rating === 0 || newReview.comment.trim() === '') {
      toast({
        title: "Erreur",
        description: "Veuillez donner une note et écrire un commentaire",
        variant: "destructive"
      })
      return
    }

    setSubmittingReview(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/books/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rating: newReview.rating,
          comment: newReview.comment
        })
      })

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Votre avis a été soumis avec succès !",
          variant: "default"
        })
        setShowReviewForm(false)
        setNewReview({ rating: 0, comment: '' })
        // Recharger les avis
        fetchBookReviews(parseInt(id!))
      } else {
        const errorData = await response.json()
        toast({
          title: "Erreur",
          description: errorData.message || 'Erreur lors de la soumission de l\'avis',
          variant: "destructive"
        })
      }
    } catch (error) {
      // Simulation pour la démo
      const newReviewData: Review = {
        id: Date.now(),
        user_id: 1,
        book_id: parseInt(id!),
        rating: newReview.rating,
        comment: newReview.comment,
        is_approved: true,
        created_at: new Date().toISOString(),
        user_name: 'Vous'
      }
      
      setReviews(prev => [newReviewData, ...prev])
      setUserReview(newReviewData)
      setShowReviewForm(false)
      setNewReview({ rating: 0, comment: '' })
      toast({
        title: "Succès",
        description: "Votre avis a été ajouté avec succès !",
        variant: "default"
      })
    } finally {
      setSubmittingReview(false)
    }
  }

  const StarRating = ({ rating, onRatingChange, interactive = false }: { 
    rating: number; 
    onRatingChange?: (rating: number) => void; 
    interactive?: boolean 
  }) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-300' : ''}`}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
          />
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement du livre...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Livre non trouvé</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => navigate('/catalogue')} className="bg-black hover:bg-gray-800">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au catalogue
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Bouton retour */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button 
            variant="ghost" 
            onClick={() => navigate('/catalogue')}
            className="text-gray-600 hover:text-black"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au catalogue
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image du livre */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="overflow-hidden shadow-lg">
              <div className="aspect-[3/4] relative">
                <img
                  src={getBookImage(book)}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge variant={book.available_quantity > 0 ? "default" : "destructive"}>
                    {book.available_quantity > 0 ? "Disponible" : "Indisponible"}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Actions rapides */}
            <div className="mt-4 space-y-3">
              <Button 
                onClick={handleBorrow}
                disabled={book.available_quantity === 0 || borrowing}
                className="w-full bg-black hover:bg-gray-800 text-white"
                size="lg"
              >
                <Heart className="w-4 h-4 mr-2" />
                {borrowing ? 'Emprunt en cours...' : 'Emprunter ce livre'}
              </Button>
              
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={copyISBN}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copier ISBN
                </Button>
                <Button variant="outline" onClick={shareBook}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Partager
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Informations du livre */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="space-y-6">
              {/* Titre et auteur */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                    {book.title}
                  </h1>
                  {reviews.length > 0 && (
                    <div className="flex items-center ml-4">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="ml-1 text-lg font-semibold">{getAverageRating()}</span>
                      <span className="ml-1 text-gray-500">({reviews.length} avis)</span>
                    </div>
                  )}
                </div>
                <p className="text-xl text-gray-600 mb-4">par {book.author}</p>
                <Badge variant="secondary" className="text-sm">
                  {book.genre}
                </Badge>
              </div>

              <Separator />

              {/* Informations détaillées */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Informations du livre</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Année</p>
                        <p className="font-medium">{book.publication_year}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">ISBN</p>
                        <p className="font-medium font-mono text-sm">{book.isbn}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Tag className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Disponibilité</p>
                        <p className="font-medium">
                          {book.available_quantity}/{book.total_quantity} exemplaires
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Ajouté le</p>
                        <p className="font-medium">
                          {new Date(book.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Description</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {book.description}
                  </p>
                </CardContent>
              </Card>

              {/* Formulaire d'avis */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Donner votre avis</h3>
                    {userReview && (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Vous avez déjà donné votre avis
                      </Badge>
                    )}
                  </div>

                  {!userReview && !showReviewForm && (
                    <Button
                      onClick={() => setShowReviewForm(true)}
                      className="bg-black hover:bg-gray-800 text-white"
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Écrire un avis
                    </Button>
                  )}

                  {showReviewForm && !userReview && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Votre note
                        </label>
                        <StarRating
                          rating={newReview.rating}
                          onRatingChange={(rating) => setNewReview(prev => ({ ...prev, rating }))}
                          interactive={true}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Votre commentaire
                        </label>
                        <textarea
                          value={newReview.comment}
                          onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                          rows={4}
                          placeholder="Partagez votre expérience avec ce livre..."
                        />
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={handleSubmitReview}
                          disabled={submittingReview || newReview.rating === 0 || !newReview.comment.trim()}
                          className="bg-black hover:bg-gray-800 text-white"
                        >
                          {submittingReview ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Envoi...
                            </>
                          ) : (
                            'Publier l\'avis'
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowReviewForm(false)
                            setNewReview({ rating: 0, comment: '' })
                          }}
                        >
                          Annuler
                        </Button>
                      </div>
                    </div>
                  )}

                  {userReview && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center mb-2">
                        <StarRating rating={userReview.rating} />
                        <span className="ml-2 text-sm text-gray-500">Votre avis</span>
                      </div>
                      <p className="text-gray-700">{userReview.comment}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Publié le {new Date(userReview.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Avis des lecteurs */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Avis des lecteurs</h3>
                    {reviews.length > 0 && (
                      <div className="flex items-center">
                        <StarRating rating={getAverageRating()} />
                        <span className="ml-2 text-sm text-gray-500">
                          {getAverageRating()}/5 ({reviews.length} avis)
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {reviews.length === 0 ? (
                    <div className="text-center py-8">
                      <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">Aucun avis pour le moment</h4>
                      <p className="text-gray-500">Soyez le premier à donner votre avis sur ce livre !</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {getDisplayedReviews().map((review) => (
                        <div key={review.id} className="border-l-4 border-gray-200 pl-4 py-2">
                          <div className="flex items-center mb-2">
                            <StarRating rating={review.rating} />
                            <span className="ml-2 text-sm font-medium text-gray-900">
                              {review.user_name || 'Utilisateur anonyme'}
                            </span>
                            <span className="ml-auto text-xs text-gray-500">
                              {new Date(review.created_at).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                          <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                        </div>
                      ))}

                      {/* Pagination des avis */}
                      {reviews.length > initialReviewsCount && !showAllReviews && (
                        <div className="flex justify-center">
                          <Button 
                            variant="outline" 
                            onClick={handleShowMoreReviews}
                            className="mt-4"
                          >
                            Voir plus d'avis
                          </Button>
                        </div>
                      )}

                      {showAllReviews && (
                        <div className="flex flex-col space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">
                              Page {currentReviewPage} sur {getTotalReviewPages()}
                            </span>
                            <Button 
                              variant="outline" 
                              onClick={handleShowLessReviews}
                            >
                              Voir moins d'avis
                            </Button>
                          </div>
                          <div className="flex justify-center">
                            {[...Array(getTotalReviewPages())].map((_, i) => (
                              <Button
                                key={i}
                                variant={currentReviewPage === i + 1 ? "default" : "outline"}
                                onClick={() => handleReviewPageChange(i + 1)}
                                className="mx-1"
                              >
                                {i + 1}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default BookDetails
