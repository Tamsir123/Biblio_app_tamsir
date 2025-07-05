import React, { useState, useEffect } from 'react';
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
  X,
  Zap,
  Award,
  Layers,
  TrendingUp,
  MessageCircle,
  ThumbsUp,
  Sparkles,
  Book,
  Archive
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

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

interface EnhancedBookDetailsModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const EnhancedBookDetailsModal: React.FC<EnhancedBookDetailsModalProps> = ({
  book,
  isOpen,
  onClose,
  onEdit,
  onDelete
}) => {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!book) return null;

  const getBookCover = () => {
    if (book.cover_image) {
      if (book.cover_image.startsWith('http')) {
        return book.cover_image;
      }
      return `http://localhost:5000${book.cover_image.startsWith('/') ? '' : '/'}${book.cover_image}`;
    }
    return `https://picsum.photos/400/600?random=${book.id}`;
  };

  const availabilityPercentage = (book.available_quantity / book.total_quantity) * 100;
  const isAvailable = book.available_quantity > 0;
  const popularity = Math.floor(Math.random() * 100) + 1; // Simulation

  const getGenreColor = (genre?: string) => {
    const colors = {
      'Fiction': 'from-purple-500 to-pink-500',
      'Science': 'from-blue-500 to-cyan-500',
      'Histoire': 'from-amber-500 to-orange-500',
      'Biographie': 'from-green-500 to-emerald-500',
      'Technologie': 'from-indigo-500 to-purple-500',
      'Art': 'from-rose-500 to-pink-500'
    };
    return colors[genre as keyof typeof colors] || 'from-gray-500 to-slate-500';
  };

  const handleCopyISBN = () => {
    if (book.isbn) {
      navigator.clipboard.writeText(book.isbn);
      toast({
        title: "Copié !",
        description: "ISBN copié dans le presse-papiers",
        variant: "default"
      });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: book.title,
        text: `Découvrez "${book.title}" par ${book.author}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Copié !",
        description: "Lien partagé copié",
        variant: "default"
      });
    }
  };

  const tabs = [
    { id: 'overview', label: 'Aperçu', icon: Eye },
    { id: 'details', label: 'Détails', icon: Layers },
    { id: 'stats', label: 'Statistiques', icon: TrendingUp }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with floating close button */}
            <div className="relative">
              <div className={`h-32 bg-gradient-to-r ${getGenreColor(book.genre)} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20"></div>
                <motion.div 
                  className="absolute top-4 right-4 z-10"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    onClick={onClose}
                    variant="ghost"
                    size="icon"
                    className="bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-sm"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </motion.div>
                
                {/* Floating elements */}
                <motion.div
                  className="absolute top-6 left-8 text-white/80"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-5 w-5" />
                    <span className="text-sm font-medium">Bibliothèque Premium</span>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="flex max-h-[calc(90vh-8rem)] overflow-hidden">
              {/* Left side - Book cover and quick actions */}
              <div className="w-80 p-8 bg-gradient-to-b from-gray-50 to-white border-r border-gray-100">
                <motion.div
                  className="relative group"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="relative">
                    <img
                      src={getBookCover()}
                      alt={book.title}
                      className="w-full h-80 object-cover rounded-2xl shadow-2xl transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl"></div>
                    
                    {/* Floating badge */}
                    <motion.div
                      className="absolute top-4 right-4"
                      initial={{ scale: 0, rotate: 45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.3, type: "spring" }}
                    >
                      <Badge 
                        className={`${isAvailable ? 'bg-green-500' : 'bg-red-500'} text-white shadow-lg`}
                      >
                        {isAvailable ? 'Disponible' : 'Indisponible'}
                      </Badge>
                    </motion.div>
                  </div>

                  {/* Quick stats overlay */}
                  <motion.div
                    className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-indigo-600">{book.available_quantity}</div>
                        <div className="text-xs text-gray-500">Disponibles</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{popularity}%</div>
                        <div className="text-xs text-gray-500">Popularité</div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Action buttons */}
                <div className="mt-6 space-y-3">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Button
                      onClick={() => setLiked(!liked)}
                      variant={liked ? "default" : "outline"}
                      className="w-full justify-start space-x-2 group"
                    >
                      <Heart className={`h-4 w-4 transition-colors ${liked ? 'fill-current' : ''}`} />
                      <span>Ajouter aux favoris</span>
                    </Button>
                  </motion.div>

                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Button
                      onClick={() => setBookmarked(!bookmarked)}
                      variant={bookmarked ? "default" : "outline"}
                      className="w-full justify-start space-x-2"
                    >
                      <Bookmark className={`h-4 w-4 ${bookmarked ? 'fill-current' : ''}`} />
                      <span>Marquer pour plus tard</span>
                    </Button>
                  </motion.div>

                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Button
                      onClick={handleShare}
                      variant="outline"
                      className="w-full justify-start space-x-2"
                    >
                      <Share2 className="h-4 w-4" />
                      <span>Partager</span>
                    </Button>
                  </motion.div>
                </div>
              </div>

              {/* Right side - Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-8">
                  {/* Title and author */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h1 className="text-4xl font-bold text-gray-900 mb-2 leading-tight">
                      {book.title}
                    </h1>
                    <div className="flex items-center space-x-2 mb-6">
                      <User className="h-5 w-5 text-gray-500" />
                      <span className="text-xl text-gray-600 font-medium">{book.author}</span>
                    </div>
                  </motion.div>

                  {/* Tabs */}
                  <motion.div
                    className="border-b border-gray-200 mb-6"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <nav className="flex space-x-8">
                      {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                              activeTab === tab.id
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <Icon className="h-4 w-4" />
                              <span>{tab.label}</span>
                            </div>
                          </button>
                        );
                      })}
                    </nav>
                  </motion.div>

                  {/* Tab content */}
                  <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                      <motion.div
                        key="overview"
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        {/* Genre and year */}
                        <div className="flex flex-wrap gap-3">
                          {book.genre && (
                            <Badge className={`bg-gradient-to-r ${getGenreColor(book.genre)} text-white px-4 py-2`}>
                              <Tag className="h-4 w-4 mr-1" />
                              {book.genre}
                            </Badge>
                          )}
                          {book.publication_year && (
                            <Badge variant="outline" className="px-4 py-2">
                              <Calendar className="h-4 w-4 mr-1" />
                              {book.publication_year}
                            </Badge>
                          )}
                        </div>

                        {/* Description */}
                        {book.description && (
                          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                            <CardContent className="p-6">
                              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                                Description
                              </h3>
                              <p className="text-gray-700 leading-relaxed">{book.description}</p>
                            </CardContent>
                          </Card>
                        )}

                        {/* Availability progress */}
                        <Card>
                          <CardContent className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                              <Archive className="h-5 w-5 mr-2 text-purple-600" />
                              Disponibilité
                            </h3>
                            <div className="space-y-3">
                              <div className="flex justify-between text-sm text-gray-600">
                                <span>Exemplaires disponibles</span>
                                <span>{book.available_quantity} / {book.total_quantity}</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-3">
                                <motion.div
                                  className={`h-3 rounded-full bg-gradient-to-r ${
                                    availabilityPercentage > 70 ? 'from-green-400 to-green-600' :
                                    availabilityPercentage > 30 ? 'from-yellow-400 to-orange-500' :
                                    'from-red-400 to-red-600'
                                  }`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${availabilityPercentage}%` }}
                                  transition={{ duration: 1, delay: 0.5 }}
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}

                    {activeTab === 'details' && (
                      <motion.div
                        key="details"
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      >
                        <Card className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="font-semibold text-gray-900">ISBN</h3>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleCopyISBN}
                                className="h-8 w-8 p-0"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-gray-600 font-mono text-sm">
                              {book.isbn || 'Non renseigné'}
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <h3 className="font-semibold text-gray-900 mb-3">Éditeur</h3>
                            <p className="text-gray-600">Éditions Académiques</p>
                          </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <h3 className="font-semibold text-gray-900 mb-3">Pages</h3>
                            <p className="text-gray-600">{Math.floor(Math.random() * 400) + 100} pages</p>
                          </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <h3 className="font-semibold text-gray-900 mb-3">Langue</h3>
                            <p className="text-gray-600">Français</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}

                    {activeTab === 'stats' && (
                      <motion.div
                        key="stats"
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <Card className="text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                            <CardContent className="p-6">
                              <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                              <div className="text-2xl font-bold text-blue-900">
                                {Math.floor(Math.random() * 50) + 10}
                              </div>
                              <div className="text-sm text-blue-700">Emprunts ce mois</div>
                            </CardContent>
                          </Card>

                          <Card className="text-center bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                            <CardContent className="p-6">
                              <Star className="h-8 w-8 text-green-600 mx-auto mb-3" />
                              <div className="text-2xl font-bold text-green-900">
                                {(Math.random() * 2 + 3).toFixed(1)}
                              </div>
                              <div className="text-sm text-green-700">Note moyenne</div>
                            </CardContent>
                          </Card>

                          <Card className="text-center bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                            <CardContent className="p-6">
                              <Award className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                              <div className="text-2xl font-bold text-purple-900">#{Math.floor(Math.random() * 10) + 1}</div>
                              <div className="text-sm text-purple-700">Classement</div>
                            </CardContent>
                          </Card>
                        </div>

                        <Card>
                          <CardContent className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                              <MessageCircle className="h-5 w-5 mr-2 text-indigo-600" />
                              Activité récente
                            </h3>
                            <div className="space-y-3">
                              {Array.from({ length: 3 }, (_, i) => (
                                <div key={i} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  <span className="text-sm text-gray-600">
                                    Emprunté par un étudiant il y a {i + 1} jour{i > 0 ? 's' : ''}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Action buttons */}
                  {(onEdit || onDelete) && (
                    <motion.div
                      className="flex space-x-4 pt-8 border-t border-gray-200 mt-8"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      {onEdit && (
                        <Button onClick={onEdit} className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                          Modifier le livre
                        </Button>
                      )}
                      {onDelete && (
                        <Button onClick={onDelete} variant="destructive" className="flex-1">
                          Supprimer le livre
                        </Button>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EnhancedBookDetailsModal;
