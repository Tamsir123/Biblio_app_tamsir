import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, X, Send, Book } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  book: {
    id: number
    title: string
    author: string
    cover_image?: string
  }
  onReviewSubmitted: () => void
}

const ReviewModal = ({ isOpen, onClose, book, onReviewSubmitted }: ReviewModalProps) => {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rating === 0) {
      toast({
        title: "Note requise",
        description: "Veuillez donner une note avant de soumettre votre avis",
        variant: "destructive"
      })
      return
    }

    setSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour poster un avis",
          variant: "destructive"
        })
        return
      }

      const response = await fetch(`http://localhost:5000/api/books/${book.id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rating,
          comment: comment.trim()
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Avis publié !",
          description: "Merci pour votre avis ! Il sera visible après modération.",
          variant: "default"
        })
        
        // Réinitialiser le formulaire
        setRating(0)
        setComment('')
        onReviewSubmitted()
        onClose()
      } else {
        throw new Error(data.message || 'Erreur lors de la publication de l\'avis')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la publication de l'avis",
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }

  const getBookImage = (coverImage?: string) => {
    if (coverImage) {
      if (coverImage.startsWith('/')) {
        return `http://localhost:5000${coverImage}`
      }
      return coverImage
    }
    return 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop'
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="border-0 shadow-none">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 rounded-2xl p-3">
                      <Star className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Donner un avis</h2>
                      <p className="text-gray-600">Partagez votre expérience de lecture</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="rounded-full h-10 w-10 p-0 hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Informations du livre */}
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl">
                  <img
                    src={getBookImage(book.cover_image)}
                    alt={book.title}
                    className="w-16 h-20 object-cover rounded-xl shadow-sm"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">{book.title}</h3>
                    <p className="text-gray-600">{book.author}</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Système de notation */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">
                      Note <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className="focus:outline-none transition-transform hover:scale-110"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                        >
                          <Star
                            className={`w-8 h-8 ${
                              star <= (hoverRating || rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            } transition-colors duration-150`}
                          />
                        </button>
                      ))}
                      <span className="ml-3 text-sm text-gray-600">
                        {rating > 0 && (
                          <>
                            {rating}/5 - {
                              rating === 1 ? 'Décevant' :
                              rating === 2 ? 'Moyen' :
                              rating === 3 ? 'Bien' :
                              rating === 4 ? 'Très bien' :
                              'Excellent'
                            }
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Commentaire */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">
                      Commentaire (optionnel)
                    </label>
                    <Textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Partagez votre avis sur ce livre... Qu'avez-vous aimé ? Recommanderiez-vous ce livre ?"
                      className="min-h-[120px] border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl resize-none"
                      maxLength={1000}
                    />
                    <div className="text-xs text-gray-500 text-right">
                      {comment.length}/1000 caractères
                    </div>
                  </div>

                  {/* Boutons d'action */}
                  <div className="flex items-center justify-end space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={onClose}
                      className="px-6 py-2 rounded-xl"
                    >
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      disabled={rating === 0 || submitting}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Publication...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Publier l'avis
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ReviewModal
