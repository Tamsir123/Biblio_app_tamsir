import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Eye, 
  RefreshCw,
  Filter,
  X,
  Save,
  Upload,
  Download
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface Book {
  id: number
  title: string
  author: string
  isbn: string
  genre: string
  description: string
  cover_image: string
  total_quantity: number
  available_quantity: number
  publication_year: number
  created_at: string
  updated_at: string
}

interface BookFormData {
  title: string
  author: string
  isbn: string
  genre: string
  description: string
  cover_image: string
  total_quantity: number
  publication_year: number
}

const AdminBooks = () => {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    author: '',
    isbn: '',
    genre: '',
    description: '',
    cover_image: '',
    total_quantity: 1,
    publication_year: new Date().getFullYear()
  })
  const { toast } = useToast()

  // Genres disponibles
  const genres = [
    'Fiction', 'Science-Fiction', 'Mystère', 'Romance', 'Thriller',
    'Histoire', 'Biographie', 'Science', 'Philosophie', 'Art',
    'Cuisine', 'Voyage', 'Santé', 'Business', 'Technologie',
    'Littérature jeunesse', 'Poésie', 'Théâtre', 'Essai'
  ]

  useEffect(() => {
    fetchBooks()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchBooks = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/books', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setBooks(data.data?.books || [])
      } else {
        throw new Error('Erreur lors du chargement des livres')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les livres",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddBook = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Livre ajouté avec succès"
        })
        setShowAddDialog(false)
        resetForm()
        fetchBooks()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erreur lors de l\'ajout')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le livre",
        variant: "destructive"
      })
    }
  }

  const handleEditBook = async () => {
    if (!editingBook) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/books/${editingBook.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Livre modifié avec succès"
        })
        setShowEditDialog(false)
        setEditingBook(null)
        resetForm()
        fetchBooks()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erreur lors de la modification')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast({
        title: "Erreur",
        description: "Impossible de modifier le livre",
        variant: "destructive"
      })
    }
  }

  const handleDeleteBook = async (bookId: number, bookTitle: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${bookTitle}" ?`)) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/books/${bookId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Livre supprimé avec succès"
        })
        fetchBooks()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le livre",
        variant: "destructive"
      })
    }
  }

  const openEditDialog = (book: Book) => {
    setEditingBook(book)
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      genre: book.genre,
      description: book.description,
      cover_image: book.cover_image,
      total_quantity: book.total_quantity,
      publication_year: book.publication_year
    })
    setShowEditDialog(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      isbn: '',
      genre: '',
      description: '',
      cover_image: '',
      total_quantity: 1,
      publication_year: new Date().getFullYear()
    })
  }

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.isbn.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGenre = !selectedGenre || book.genre === selectedGenre
    return matchesSearch && matchesGenre
  })

  const BookForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Titre *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Titre du livre"
            required
          />
        </div>
        <div>
          <Label htmlFor="author">Auteur *</Label>
          <Input
            id="author"
            value={formData.author}
            onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
            placeholder="Nom de l'auteur"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="isbn">ISBN</Label>
          <Input
            id="isbn"
            value={formData.isbn}
            onChange={(e) => setFormData(prev => ({ ...prev, isbn: e.target.value }))}
            placeholder="978-2-123456-78-9"
          />
        </div>
        <div>
          <Label htmlFor="genre">Genre</Label>
          <Select value={formData.genre} onValueChange={(value) => setFormData(prev => ({ ...prev, genre: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un genre" />
            </SelectTrigger>
            <SelectContent>
              {genres.map(genre => (
                <SelectItem key={genre} value={genre}>{genre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="total_quantity">Quantité totale</Label>
          <Input
            id="total_quantity"
            type="number"
            min="1"
            value={formData.total_quantity}
            onChange={(e) => setFormData(prev => ({ ...prev, total_quantity: parseInt(e.target.value) || 1 }))}
          />
        </div>
        <div>
          <Label htmlFor="publication_year">Année de publication</Label>
          <Input
            id="publication_year"
            type="number"
            min="1000"
            max={new Date().getFullYear()}
            value={formData.publication_year}
            onChange={(e) => setFormData(prev => ({ ...prev, publication_year: parseInt(e.target.value) || new Date().getFullYear() }))}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="cover_image">URL de la couverture</Label>
        <Input
          id="cover_image"
          value={formData.cover_image}
          onChange={(e) => setFormData(prev => ({ ...prev, cover_image: e.target.value }))}
          placeholder="https://example.com/cover.jpg"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Description du livre..."
          rows={4}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button 
          variant="outline" 
          onClick={() => {
            if (isEdit) {
              setShowEditDialog(false)
              setEditingBook(null)
            } else {
              setShowAddDialog(false)
            }
            resetForm()
          }}
        >
          Annuler
        </Button>
        <Button onClick={isEdit ? handleEditBook : handleAddBook}>
          <Save className="w-4 h-4 mr-2" />
          {isEdit ? 'Modifier' : 'Ajouter'}
        </Button>
      </div>
    </div>
  )

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
            <p className="text-xl text-gray-600">Chargement des livres...</p>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <motion.div 
        className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-black overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=400&fit=crop" 
            alt="Administration des livres" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-20">
          <motion.div 
            className="max-w-3xl"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold text-white mb-6">
              Gestion des Livres
            </h1>
            <div className="w-20 h-1 bg-white mb-6"></div>
            <p className="text-xl text-gray-200 leading-relaxed">
              Ajoutez, modifiez et gérez facilement votre collection de livres
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Contenu principal */}
      <motion.div 
        className="container mx-auto px-4 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Barre d'outils */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              {/* Recherche */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher par titre, auteur ou ISBN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filtre par genre */}
              <div className="min-w-[200px]">
                <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                  <SelectTrigger>
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Tous les genres" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous les genres</SelectItem>
                    {genres.map(genre => (
                      <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              {/* Actualiser */}
              <Button variant="outline" onClick={fetchBooks}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualiser
              </Button>

              {/* Ajouter un livre */}
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter un livre
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Ajouter un nouveau livre</DialogTitle>
                  </DialogHeader>
                  <BookForm />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div 
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
            whileHover={{ y: -4, shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{books.length}</p>
                <p className="text-sm text-gray-600">Total livres</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
            whileHover={{ y: -4, shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="flex items-center">
              <Eye className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{filteredBooks.length}</p>
                <p className="text-sm text-gray-600">Affichés</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
            whileHover={{ y: -4, shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="flex items-center">
              <RefreshCw className="w-8 h-8 text-orange-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {books.reduce((sum, book) => sum + book.total_quantity, 0)}
                </p>
                <p className="text-sm text-gray-600">Exemplaires</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
            whileHover={{ y: -4, shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {books.reduce((sum, book) => sum + book.available_quantity, 0)}
                </p>
                <p className="text-sm text-gray-600">Disponibles</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Liste des livres */}
        <div className="space-y-4">
          {filteredBooks.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-gray-100">
              <BookOpen className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-medium text-gray-900 mb-3">
                {searchTerm || selectedGenre ? 'Aucun livre trouvé' : 'Aucun livre'}
              </h3>
              <p className="text-gray-600 text-lg">
                {searchTerm || selectedGenre 
                  ? 'Essayez de modifier vos critères de recherche'
                  : 'Commencez par ajouter votre premier livre'
                }
              </p>
            </div>
          ) : (
            filteredBooks.map((book) => (
              <motion.div
                key={book.id}
                whileHover={{ y: -3 }}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex items-start gap-6">
                    {/* Image du livre */}
                    <img
                      src={book.cover_image || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop'}
                      alt={book.title}
                      className="w-20 h-28 object-cover rounded-2xl shadow-md"
                    />

                    {/* Informations du livre */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{book.title}</h3>
                          <p className="text-gray-600 mb-1">Par {book.author}</p>
                          <p className="text-sm text-gray-500">ISBN: {book.isbn}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{book.genre}</Badge>
                          <Badge variant={book.available_quantity > 0 ? "default" : "destructive"}>
                            {book.available_quantity}/{book.total_quantity} disponible(s)
                          </Badge>
                        </div>
                      </div>

                      {/* Description */}
                      {book.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {book.description}
                        </p>
                      )}

                      {/* Métadonnées */}
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <span>Publié en {book.publication_year}</span>
                        <span>•</span>
                        <span>Ajouté le {new Date(book.created_at).toLocaleDateString('fr-FR')}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(book)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Modifier
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteBook(book.id, book.title)}
                          className="text-red-600 hover:text-red-700 hover:border-red-300"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Dialog de modification */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Modifier le livre</DialogTitle>
            </DialogHeader>
            <BookForm isEdit={true} />
          </DialogContent>
        </Dialog>
      </motion.div>

      <Footer />
    </div>
  )
}

export default AdminBooks
