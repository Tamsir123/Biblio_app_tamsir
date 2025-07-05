import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  User, 
  Calendar, 
  Hash, 
  Tag, 
  Star, 
  Users, 
  Clock,
  Copy,
  Download,
  Heart,
  Share2,
  Bookmark,
  Eye,
  X
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Book {
  id: number;
  title: string;
  author: string;
  genre?: string;
  isbn?: string;
  publication_year?: string;
  total_quantity: number;
  available_quantity: number;
  description?: string;
  cover_image?: string;
}

interface BookDetailsModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const BookDetailsModal: React.FC<BookDetailsModalProps> = ({
  book,
  isOpen,
  onClose,
  onEdit,
  onDelete
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  if (!book) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header avec actions */}
            <div className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 text-white p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{book.title}</h2>
                    <p className="text-white/80 text-lg">par {book.author}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 p-2"
                    onClick={() => setIsFavorite(!isFavorite)}
                  >
                    <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 p-2"
                    onClick={() => setIsBookmarked(!isBookmarked)}
                  >
                    <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 p-2"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 p-2"
                    onClick={onClose}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Image et actions principales */}
                <div className="lg:col-span-1">
                  <Card className="overflow-hidden border-0 shadow-lg">
                    <CardContent className="p-0">
                      <div className="relative group">
                        {book.cover_image ? (
                          <motion.img
                            src={`http://localhost:5000${book.cover_image}`}
                            alt={book.title}
                            className="w-full h-80 object-cover"
                            onLoad={() => setImageLoaded(true)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: imageLoaded ? 1 : 0 }}
                            transition={{ duration: 0.3 }}
                          />
                        ) : (
                          <div className="w-full h-80 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <BookOpen className="h-16 w-16 text-gray-400" />
                          </div>
                        )}
                        
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="bg-white/90 text-black hover:bg-white"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Voir en grand
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Actions rapides */}
                  <div className="mt-6 space-y-3">
                    {onEdit && (
                      <Button
                        onClick={onEdit}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      >
                        Modifier ce livre
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="w-full hover:bg-gray-50"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger les infos
                    </Button>
                    {onDelete && (
                      <Button
                        onClick={onDelete}
                        variant="destructive"
                        className="w-full"
                      >
                        Supprimer
                      </Button>
                    )}
                  </div>
                </div>

                {/* Informations détaillées */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Métriques */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl"
                    >
                      <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-600">
                        {book.available_quantity || 0}
                      </div>
                      <div className="text-sm text-gray-600">Disponibles</div>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl"
                    >
                      <BookOpen className="h-6 w-6 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-600">
                        {book.total_quantity || 0}
                      </div>
                      <div className="text-sm text-gray-600">Total</div>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl"
                    >
                      <Star className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-yellow-600">4.5</div>
                      <div className="text-sm text-gray-600">Note</div>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl"
                    >
                      <Clock className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-purple-600">24</div>
                      <div className="text-sm text-gray-600">Emprunts</div>
                    </motion.div>
                  </div>

                  {/* Informations principales */}
                  <Card className="border-0 shadow-sm bg-gray-50">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Tag className="h-5 w-5 mr-2 text-indigo-600" />
                        Informations du livre
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3">
                          <User className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Auteur</p>
                            <p className="font-medium">{book.author}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Calendar className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Année de publication</p>
                            <p className="font-medium">{book.publication_year || 'Non spécifiée'}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Hash className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">ISBN</p>
                            <div className="flex items-center space-x-2">
                              <p className="font-medium">{book.isbn || 'Non spécifié'}</p>
                              {book.isbn && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-1 h-auto"
                                  onClick={() => copyToClipboard(book.isbn)}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Tag className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Genre</p>
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                                {book.genre || 'Non catégorisé'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Description */}
                  {book.description && (
                    <Card className="border-0 shadow-sm">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-3">Description</h3>
                        <p className="text-gray-700 leading-relaxed">{book.description}</p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Statut de disponibilité */}
                  <Card className="border-0 shadow-sm bg-gradient-to-r from-emerald-50 to-teal-50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-emerald-800">
                            Statut de disponibilité
                          </h3>
                          <p className="text-emerald-600">
                            {(book.available_quantity || 0) > 0 
                              ? `${book.available_quantity} exemplaire(s) disponible(s)`
                              : 'Aucun exemplaire disponible'
                            }
                          </p>
                        </div>
                        <div className={`w-4 h-4 rounded-full ${
                          (book.available_quantity || 0) > 0 ? 'bg-emerald-500' : 'bg-red-500'
                        }`}></div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
