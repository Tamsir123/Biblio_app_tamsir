import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  Users, 
  BookOpen, 
  FileText, 
  Star,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  Settings,
  LogOut,
  Menu,
  Search,
  Plus,
  Eye,
  RefreshCw,
  BarChart3,
  Activity,
  Bell,
  Shield,
  LucideIcon,
  Download,
  PieChart,
  LineChart
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { Dialog } from '@/components/ui/dialog'

// Import des composants analytics
import { 
  TrendChart, 
  ActivityChart, 
  PopularBooksChart, 
  CategoryChart, 
  BorrowingStatsChart 
} from '@/components/analytics/Charts'
import { ExportButtons, StatCardAnalytics } from '@/components/analytics/AnalyticsComponents'
import { analyticsService, DashboardAnalytics, BorrowingAnalytics } from '@/services/analyticsService'

// Import du composant de détails des livres
import EnhancedBookDetailsModal from '@/components/books/EnhancedBookDetailsModal'

interface DashboardStats {
  total_users: number
  total_books: number
  total_borrowings: number
  active_borrowings: number
  overdue_borrowings: number
  pending_reviews: number
  new_users_this_month: number
  books_borrowed_this_month: number
  total_reviews: number
  average_rating: number
}

interface User {
  id: number
  name: string
  email: string
  role: 'student' | 'admin'
  is_active: boolean
  profile_image?: string
  phone?: string
  address?: string
  date_of_birth?: string
  created_at: string
  updated_at: string
}

interface UserStats {
  active_borrowings: number
  total_borrowed: number
  overdue_books: number
  reviews_given: number
  average_rating_given: number
}

interface Borrowing {
  id: number
  user_id: number
  book_id: number
  borrowed_at: string
  due_date: string
  returned_at?: string
  status: 'active' | 'returned' | 'overdue'
  current_status: 'active' | 'returned' | 'overdue'
  days_overdue?: number
  notes?: string
  user_name: string
  user_email: string
  title: string
  author: string
  isbn: string
}

interface BorrowingsResponse {
  borrowings: Borrowing[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

interface RecentActivity {
  id: number
  type: 'borrowing' | 'return' | 'user_registration' | 'book_added' | 'review_added'
  message: string
  timestamp: string
  user?: string
}

interface QuickAction {
  icon: LucideIcon
  label: string
  description: string
  action: () => void
  variant: 'default' | 'destructive' | 'outline' | 'secondary'
  color: string
}

interface StatCardProps {
  icon: LucideIcon
  title: string
  value: number | string
  change?: number
  color: string
  description?: string
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [books, setBooks] = useState([])
  const [booksLoading, setBooksLoading] = useState(false)
  const [borrowings, setBorrowings] = useState([])
  const [borrowingsLoading, setBorrowingsLoading] = useState(false)
  const [borrowingsStats, setBorrowingsStats] = useState(null)
  const [users, setUsers] = useState<User[]>([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [userBorrowings, setUserBorrowings] = useState<Borrowing[]>([])
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [showEditUserModal, setShowEditUserModal] = useState(false)
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student' as 'student' | 'admin'
  })
  const [showAddBookModal, setShowAddBookModal] = useState(false)
  const [showEditBookModal, setShowEditBookModal] = useState(false)
  const [showBookDetailsModal, setShowBookDetailsModal] = useState(false)
  
  // États pour les analytics
  const [analyticsData, setAnalyticsData] = useState<DashboardAnalytics | null>(null)
  const [borrowingAnalytics, setBorrowingAnalytics] = useState<BorrowingAnalytics | null>(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const [selectedBook, setSelectedBook] = useState(null)
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null)
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    genre: '',
    isbn: '',
    publication_year: '',
    total_quantity: 1,
    description: ''
  })
  const navigate = useNavigate()
  const { toast } = useToast()

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      if (!token) {
        console.log('Pas de token pour récupérer les stats')
        setLoading(false)
        return
      }

      console.log('Récupération des statistiques du dashboard...')
      
      // Récupérer les statistiques réelles depuis l'API
      const [booksRes, usersRes, borrowingsRes] = await Promise.all([
        fetch('http://localhost:5000/api/books', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        }).catch(() => null), // En cas d'erreur, continuer sans les users
        fetch('http://localhost:5000/api/borrowings', {
          headers: { 'Authorization': `Bearer ${token}` }
        }).catch(() => null) // En cas d'erreur, continuer sans les emprunts
      ])

      let totalBooks = 0
      let totalUsers = 245 // Valeur par défaut si l'API users n'est pas disponible
      let totalBorrowings = 0
      let activeBorrowings = 0
      let overdueBorrowings = 0

      // Traiter les livres
      if (booksRes.ok) {
        const booksData = await booksRes.json()
        console.log('Données livres pour stats:', booksData)
        totalBooks = booksData.data?.books ? booksData.data.books.length : 
                    booksData.books ? booksData.books.length : 0
        console.log('Nombre de livres récupérés:', totalBooks)
      } else {
        console.log('Erreur lors de la récupération des livres:', booksRes.status)
      }

      // Traiter les utilisateurs (si l'API est disponible)
      if (usersRes && usersRes.ok) {
        const usersData = await usersRes.json()
        console.log('Données utilisateurs pour stats:', usersData)
        // Adapter la structure de réponse pour les utilisateurs
        const usersArray = usersData.data?.users || usersData.users || []
        totalUsers = usersArray.length
        console.log('Nombre d\'utilisateurs récupérés pour les stats:', totalUsers)
      } else if (usersRes) {
        console.log('Erreur lors de la récupération des utilisateurs pour les stats:', usersRes.status)
        // Essayer de récupérer depuis l'état local si disponible
        if (users.length > 0) {
          totalUsers = users.length
          console.log('Utilisation du nombre d\'utilisateurs depuis l\'état local:', totalUsers)
        }
      } else {
        console.log('API users non disponible pour les stats, utilisation de la valeur par défaut')
        // Essayer de récupérer depuis l'état local si disponible
        if (users.length > 0) {
          totalUsers = users.length
          console.log('Utilisation du nombre d\'utilisateurs depuis l\'état local:', totalUsers)
        }
      }

      // Traiter les emprunts (si l'API est disponible)
      if (borrowingsRes && borrowingsRes.ok) {
        const borrowingsData = await borrowingsRes.json()
        console.log('Données emprunts pour stats:', borrowingsData)
        
        const borrowings = borrowingsData.data?.borrowings || borrowingsData.borrowings || []
        totalBorrowings = borrowingsData.data?.pagination?.total || borrowings.length
        
        // Compter les emprunts actifs et en retard
        activeBorrowings = borrowings.filter(b => b.current_status === 'active').length
        overdueBorrowings = borrowings.filter(b => b.current_status === 'overdue').length
        
        console.log('Statistiques emprunts:', {
          total: totalBorrowings,
          actifs: activeBorrowings,
          retards: overdueBorrowings
        })
      } else {
        console.log('Erreur lors de la récupération des emprunts pour les stats')
      }

      // Créer les statistiques avec les vraies données
      const realStats: DashboardStats = {
        total_users: totalUsers,
        total_books: totalBooks,
        total_borrowings: totalBorrowings,
        active_borrowings: activeBorrowings,
        overdue_borrowings: overdueBorrowings,
        pending_reviews: 0,
        new_users_this_month: 0,
        books_borrowed_this_month: 0,
        total_reviews: 0,
        average_rating: 0
      }

      console.log('Statistiques finales:', realStats)
      setStats(realStats)
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }, [toast, users.length])

  const fetchBooks = useCallback(async () => {
    setBooksLoading(true)
    try {
      console.log('=== RÉCUPÉRATION DES LIVRES ===')
      console.log('URL:', 'http://localhost:5000/api/books')
      
      const res = await fetch('http://localhost:5000/api/books')
      console.log('Statut de la réponse:', res.status, res.statusText)
      
      const data = await res.json()
      console.log('Données brutes reçues:', data)
      console.log('Type de data:', typeof data)
      console.log('data.data:', data.data)
      console.log('data.data.books:', data.data?.books)
      console.log('Nombre de livres:', data.data?.books ? data.data.books.length : 'undefined')
      
      if (!res.ok) throw new Error(data.message || 'Erreur lors du chargement des livres')
      
      // Adapter la structure de réponse
      const booksArray = data.data?.books || data.books || data || []
      console.log('Livres à afficher:', booksArray)
      console.log('Nombre final de livres:', booksArray.length)
      
      setBooks(booksArray)
    } catch (error) {
      console.error('=== ERREUR LORS DU CHARGEMENT DES LIVRES ===')
      console.error('Error:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les livres",
        variant: "destructive"
      })
    } finally {
      setBooksLoading(false)
    }
  }, [toast])

  const fetchBorrowings = useCallback(async () => {
    setBorrowingsLoading(true)
    try {
      console.log('=== RÉCUPÉRATION DES EMPRUNTS ===')
      const token = localStorage.getItem('token')
      
      if (!token) {
        console.error('Token manquant pour récupérer les emprunts')
        return
      }

      console.log('URL:', 'http://localhost:5000/api/borrowings')
      
      const res = await fetch('http://localhost:5000/api/borrowings', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      console.log('Statut de la réponse emprunts:', res.status, res.statusText)
      
      const data = await res.json()
      console.log('Données brutes emprunts reçues:', data)
      
      if (!res.ok) throw new Error(data.message || 'Erreur lors du chargement des emprunts')
      
      // Adapter la structure de réponse
      const borrowingsData = data.data?.borrowings || data.borrowings || []
      console.log('Emprunts à afficher:', borrowingsData)
      console.log('Nombre d\'emprunts:', borrowingsData.length)
      
      setBorrowings(borrowingsData)
      setBorrowingsStats(data.data?.pagination || null)
    } catch (error) {
      console.error('=== ERREUR LORS DU CHARGEMENT DES EMPRUNTS ===')
      console.error('Error:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les emprunts",
        variant: "destructive"
      })
    } finally {
      setBorrowingsLoading(false)
    }
  }, [toast])

  const fetchUsers = useCallback(async () => {
    setUsersLoading(true)
    try {
      console.log('=== RÉCUPÉRATION DES UTILISATEURS ===')
      const token = localStorage.getItem('token')
      const userStr = localStorage.getItem('user')
      
      if (!token) {
        console.error('Token manquant pour récupérer les utilisateurs')
        return
      }

      console.log('Token présent:', !!token)
      console.log('User data from localStorage:', userStr)
      
      if (userStr) {
        const user = JSON.parse(userStr)
        console.log('Utilisateur connecté:', user)
        console.log('Rôle utilisateur:', user.role)
        console.log('Est admin?', user.role === 'admin')
        
        if (user.role !== 'admin') {
          console.error('Utilisateur non admin tentant d\'accéder aux utilisateurs')
          toast({
            title: "Accès refusé",
            description: "Vous devez être administrateur pour voir les utilisateurs",
            variant: "destructive"
          })
          return
        }
      }

      console.log('URL:', 'http://localhost:5000/api/users')
      
      const res = await fetch('http://localhost:5000/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      console.log('Statut de la réponse utilisateurs:', res.status, res.statusText)
      
      const data = await res.json()
      console.log('Données brutes utilisateurs reçues:', data)
      
      if (!res.ok) throw new Error(data.message || 'Erreur lors du chargement des utilisateurs')
      
      // Adapter la structure de réponse
      const usersData = data.data?.users || data.users || []
      console.log('Utilisateurs à afficher:', usersData)
      console.log('Nombre d\'utilisateurs:', usersData.length)
      
      setUsers(usersData)
      console.log('État users après setUsers:', usersData)
      console.log('users state updated, length:', usersData.length)
    } catch (error) {
      console.error('=== ERREUR LORS DU CHARGEMENT DES UTILISATEURS ===')
      console.error('Error:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les utilisateurs",
        variant: "destructive"
      })
    } finally {
      setUsersLoading(false)
    }
  }, [toast])

  const handleAddUser = async (userData: typeof newUser) => {
    try {
      const token = localStorage.get
      
      if (!token) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté",
          variant: "destructive"
        })
        return
      }

      const res = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })

      const data = await res.json()
      
      if (!res.ok) throw new Error(data.message)

      toast({
        title: "Succès",
        description: "Utilisateur ajouté avec succès"
      })
      
      // Rafraîchir les données
      fetchUsers()
      fetchDashboardData() // Mettre à jour les statistiques
      
      setShowAddUserModal(false)
      setNewUser({
        name: '',
        email: '',
        password: '',
        role: 'student'
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de l'ajout",
        variant: "destructive"
      })
    }
  }

  const handleEditUser = async (userData: Partial<User>) => {
    try {
      const token = localStorage.getItem('token')
      
      if (!token || !selectedUser) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté",
          variant: "destructive"
        })
        return
      }

      const res = await fetch(`http://localhost:5000/api/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })

      const data = await res.json()
      
      if (!res.ok) throw new Error(data.message)

      toast({
        title: "Succès",
        description: "Utilisateur modifié avec succès"
      })
      
      // Rafraîchir les données
      fetchUsers()
      fetchDashboardData() // Mettre à jour les statistiques
      
      setShowEditUserModal(false)
      setSelectedUser(null)
      setNewUser({
        name: '',
        email: '',
        password: '',
        role: 'student'
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la modification",
        variant: "destructive"
      })
    }
  }

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return

    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await res.json()
      
      if (!res.ok) throw new Error(data.message)

      toast({
        title: "Succès",
        description: "Utilisateur supprimé avec succès"
      })
      
      // Rafraîchir les données
      fetchUsers()
      fetchDashboardData() // Mettre à jour les statistiques
    } catch (error) {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la suppression",
        variant: "destructive"
      })
    }
  }

  const fetchUserDetails = async (userId: number) => {
    try {
      const token = localStorage.getItem('token')
      
      if (!token) return

      // Récupérer les statistiques de l'utilisateur
      const statsRes = await fetch(`http://localhost:5000/api/users/${userId}/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setUserStats(statsData.data)
      }

      // Récupérer l'historique des emprunts
      const borrowingsRes = await fetch(`http://localhost:5000/api/users/${userId}/borrowings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (borrowingsRes.ok) {
        const borrowingsData = await borrowingsRes.json()
        setUserBorrowings(borrowingsData.data?.borrowings || [])
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des détails utilisateur:', error)
    }
  }

  const handleAddBook = async (bookData) => {
    try {
      const token = localStorage.getItem('token')
      const userStr = localStorage.getItem('user')
      
      console.log('=== TENTATIVE D\'AJOUT DE LIVRE ===')
      console.log('Token présent:', !!token)
      console.log('Token value:', token ? token.substring(0, 20) + '...' : 'null')
      console.log('User data:', userStr)
      
      if (!token) {
        console.log('ERREUR: Aucun token trouvé')
        toast({
          title: "Erreur",
          description: "Vous devez être connecté",
          variant: "destructive"
        })
        return
      }

      if (userStr) {
        const user = JSON.parse(userStr)
        console.log('Rôle utilisateur:', user.role)
      }

      // Préparer FormData pour supporter l'upload d'image
      const formData = new FormData()
      Object.entries(bookData).forEach(([key, value]) => {
        if (value !== '' && value !== undefined && value !== null) {
          formData.append(key, String(value))
        }
      })

      // Ajouter l'image si elle existe
      if (coverImageFile) {
        formData.append('cover_image', coverImageFile)
        console.log('Image ajoutée:', coverImageFile.name)
      }

      console.log('Données à envoyer:', Object.fromEntries(formData))
      console.log('URL de requête:', 'http://localhost:5000/api/books')
      console.log('Headers:', { 'Authorization': `Bearer ${token.substring(0, 20)}...` })

      const res = await fetch('http://localhost:5000/api/books', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Ne pas définir Content-Type pour FormData, le navigateur le fait automatiquement
        },
        body: formData
      })

      console.log('Réponse reçue:', res.status, res.statusText)
      
      const data = await res.json()
      console.log('Données de réponse:', data)
      
      if (!res.ok) throw new Error(data.message)

      toast({
        title: "Succès",
        description: "Livre ajouté avec succès"
      })
      
      // Rafraîchir les données
      fetchBooks()
      fetchDashboardData() // Mettre à jour les statistiques
      
      setShowAddBookModal(false)
      setCoverImageFile(null)
      setCoverImagePreview(null)
      setNewBook({
        title: '',
        author: '',
        genre: '',
        isbn: '',
        publication_year: '',
        total_quantity: 1,
        description: ''
      })
    } catch (error) {
      console.error('=== ERREUR LORS DE L\'AJOUT ===')
      console.error('Error object:', error)
      console.error('Error message:', error.message)
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de l'ajout",
        variant: "destructive"
      })
    }
  }

  // Fonction pour afficher les détails d'un livre
  const handleViewBookDetails = (book) => {
    setSelectedBook(book)
    setShowBookDetailsModal(true)
  }

  const handleEditBook = async (bookData) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté",
          variant: "destructive"
        })
        return
      }

      // Préparer FormData pour supporter l'upload d'image
      const formData = new FormData()
      Object.entries(bookData).forEach(([key, value]) => {
        if (value !== '' && value !== undefined && value !== null) {
          formData.append(key, String(value))
        }
      })

      // Ajouter l'image si elle existe
      if (coverImageFile) {
        formData.append('cover_image', coverImageFile)
      }

      const res = await fetch(`http://localhost:5000/api/books/${selectedBook.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
          // Ne pas définir Content-Type pour FormData
        },
        body: formData
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      toast({
        title: "Succès",
        description: "Livre modifié avec succès"
      })
      
      // Rafraîchir les données
      fetchBooks()
      fetchDashboardData() // Mettre à jour les statistiques
      
      setShowEditBookModal(false)
      setSelectedBook(null)
      setCoverImageFile(null)
      setCoverImagePreview(null)
      setNewBook({
        title: '',
        author: '',
        genre: '',
        isbn: '',
        publication_year: '',
        total_quantity: 1,
        description: ''
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la modification",
        variant: "destructive"
      })
    }
  }

  const handleDeleteBook = async (bookId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce livre ?')) return

    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`http://localhost:5000/api/books/${bookId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!res.ok) throw new Error('Erreur lors de la suppression')

      toast({
        title: "Succès",
        description: "Livre supprimé avec succès"
      })
      
      // Rafraîchir les données
      fetchBooks()
      fetchDashboardData() // Mettre à jour les statistiques
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression",
        variant: "destructive"
      })
    }
  }

  const handleLogout = () => {
    localStorage.clear()
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté avec succès"
    })
    navigate('/')
  }

  // Fonctions pour les analytics
  const fetchAnalyticsData = useCallback(async () => {
    try {
      setAnalyticsLoading(true)
      const data = await analyticsService.getDashboardStats()
      setAnalyticsData(data)
    } catch (error) {
      console.error('Erreur lors de la récupération des analytics:', error)
      toast({
        title: "Erreur Analytics",
        description: "Impossible de charger les données analytics",
        variant: "destructive"
      })
    } finally {
      setAnalyticsLoading(false)
    }
  }, [toast])

  const fetchBorrowingAnalytics = useCallback(async () => {
    try {
      const data = await analyticsService.getBorrowingAnalytics()
      setBorrowingAnalytics(data)
    } catch (error) {
      console.error('Erreur lors de la récupération des analytics emprunts:', error)
    }
  }, [])

  // Fonctions d'export
  const handleExportBorrowings = async () => {
    try {
      setExportLoading(true)
      const blob = await analyticsService.exportData('borrowings')
      const filename = `emprunts_${new Date().toISOString().split('T')[0]}.csv`
      analyticsService.downloadCSV(blob, filename)
      toast({
        title: "Export réussi",
        description: "Les données des emprunts ont été exportées"
      })
    } catch (error) {
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter les emprunts",
        variant: "destructive"
      })
    } finally {
      setExportLoading(false)
    }
  }

  const handleExportUsers = async () => {
    try {
      setExportLoading(true)
      const blob = await analyticsService.exportData('users')
      const filename = `utilisateurs_${new Date().toISOString().split('T')[0]}.csv`
      analyticsService.downloadCSV(blob, filename)
      toast({
        title: "Export réussi",
        description: "Les données des utilisateurs ont été exportées"
      })
    } catch (error) {
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter les utilisateurs",
        variant: "destructive"
      })
    } finally {
      setExportLoading(false)
    }
  }

  const handleExportBooks = async () => {
    try {
      setExportLoading(true)
      const blob = await analyticsService.exportData('books')
      const filename = `livres_${new Date().toISOString().split('T')[0]}.csv`
      analyticsService.downloadCSV(blob, filename)
      toast({
        title: "Export réussi",
        description: "Les données des livres ont été exportées"
      })
    } catch (error) {
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter les livres",
        variant: "destructive"
      })
    } finally {
      setExportLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  useEffect(() => {
    if (activeTab === 'books') {
      fetchBooks()
    } else if (activeTab === 'borrowings') {
      fetchBorrowings()
    } else if (activeTab === 'users') {
      fetchUsers()
    } else if (activeTab === 'overview') {
      // Charger les données analytics pour le dashboard
      fetchAnalyticsData()
      fetchBorrowingAnalytics()
    }
  }, [activeTab, fetchBooks, fetchBorrowings, fetchUsers, fetchAnalyticsData, fetchBorrowingAnalytics])

  // Fonctions utilitaires pour les emprunts
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getStatusBadge = (borrowing: Borrowing) => {
    const { current_status, days_overdue } = borrowing
    
    if (current_status === 'overdue') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          En retard ({days_overdue} jour{days_overdue > 1 ? 's' : ''})
        </span>
      )
    } else if (current_status === 'active') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          Actif
        </span>
      )
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Retourné
        </span>
      )
    }
  }

  const StatCard = ({ icon: Icon, title, value, change, color, description }: StatCardProps) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">{title}</p>
              <p className="text-2xl font-bold text-white mt-1">{value}</p>
              {description && (
                <p className="text-gray-500 text-xs mt-1">{description}</p>
              )}
              <div className={`h-12 w-12 rounded-lg ${color} flex items-center justify-center`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
            </div>
            {change && (
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                <span className="text-green-400 text-sm font-medium">+{change}%</span>
                <span className="text-gray-500 text-sm ml-2">ce mois</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <p className="text-gray-900 text-lg">Chargement...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Administration</h1>
                <p className="text-sm text-gray-500">Gestion de la bibliothèque</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate('/')}
              >
                Retour au site
              </Button>
              <Button
                variant="destructive"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
              { id: 'books', label: 'Gestion des livres', icon: BookOpen },
              { id: 'users', label: 'Utilisateurs', icon: Users },
              { id: 'borrowings', label: 'Emprunts', icon: FileText }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Vue d'ensemble - Dashboard Analytics */}
        {activeTab === 'overview' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Dashboard Analytics</h2>
              <div className="flex items-center space-x-3">
                <ExportButtons
                  onExportBorrowings={handleExportBorrowings}
                  onExportUsers={handleExportUsers}
                  onExportBooks={handleExportBooks}
                  loading={exportLoading}
                />
                <Button
                  onClick={() => {
                    fetchDashboardData()
                    fetchAnalyticsData()
                    toast({
                      title: "Actualisation",
                      description: "Statistiques mises à jour"
                    })
                  }}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Actualiser</span>
                </Button>
              </div>
            </div>

            {/* Statistiques générales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCardAnalytics
                title="Utilisateurs"
                value={analyticsData?.overview?.total_users || stats?.total_users || 0}
                icon={Users}
                color="bg-blue-600"
                description="Utilisateurs inscrits"
                trend={analyticsData?.trends?.users_growth ? {
                  value: analyticsData.trends.users_growth,
                  isPositive: analyticsData.trends.users_growth > 0
                } : undefined}
              />
              
              <StatCardAnalytics
                title="Livres"
                value={analyticsData?.overview?.total_books || stats?.total_books || 0}
                icon={BookOpen}
                color="bg-green-600"
                description="Titres dans la collection"
                trend={analyticsData?.trends?.books_growth ? {
                  value: analyticsData.trends.books_growth,
                  isPositive: analyticsData.trends.books_growth > 0
                } : undefined}
              />
              
              <StatCardAnalytics
                title="Emprunts actifs"
                value={analyticsData?.overview?.active_borrowings || stats?.active_borrowings || 0}
                icon={FileText}
                color="bg-yellow-600"
                description="Livres actuellement empruntés"
                trend={analyticsData?.trends?.borrowings_growth ? {
                  value: analyticsData.trends.borrowings_growth,
                  isPositive: analyticsData.trends.borrowings_growth > 0
                } : undefined}
              />
              
              <StatCardAnalytics
                title="Retards"
                value={analyticsData?.overview?.overdue_borrowings || stats?.overdue_borrowings || 0}
                icon={AlertTriangle}
                color="bg-red-600"
                description="Emprunts en retard"
              />
            </div>

            {analyticsLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Chargement des analytics...</span>
              </div>
            ) : analyticsData ? (
              <>
                {/* Section des graphiques - Ligne 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Tendances des emprunts */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <LineChart className="h-5 w-5 mr-2 text-blue-600" />
                        Tendances des emprunts (30 derniers jours)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {analyticsData?.recent_activity ? (
                        <TrendChart data={analyticsService.formatTrendData(analyticsData.recent_activity)} />
                      ) : (
                        <div className="h-[300px] flex items-center justify-center text-gray-500">
                          Aucune donnée de tendance disponible
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Heures de pointe */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Activity className="h-5 w-5 mr-2 text-purple-600" />
                        Activité par heures
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {analyticsData?.peak_hours ? (
                        <ActivityChart data={analyticsService.formatActivityData(analyticsData.peak_hours)} />
                      ) : (
                        <div className="h-[200px] flex items-center justify-center text-gray-500">
                          Aucune donnée d'activité disponible
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Section des graphiques - Ligne 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Livres populaires */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Star className="h-5 w-5 mr-2 text-yellow-600" />
                        Top 10 des livres populaires
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {analyticsData?.popular_books && analyticsData.popular_books.length > 0 ? (
                        <PopularBooksChart data={analyticsService.formatPopularBooksData(analyticsData.popular_books)} />
                      ) : (
                        <div className="h-[300px] flex items-center justify-center text-gray-500">
                          Aucune donnée de popularité disponible
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Répartition par catégories */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <PieChart className="h-5 w-5 mr-2 text-indigo-600" />
                        Répartition par genres
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {analyticsData?.categories_stats && analyticsData.categories_stats.length > 0 ? (
                        <CategoryChart data={analyticsService.formatCategoryData(analyticsData.categories_stats)} />
                      ) : (
                        <div className="h-[300px] flex items-center justify-center text-gray-500">
                          Aucune donnée de catégorie disponible
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Analytics détaillés des emprunts */}
                {borrowingAnalytics?.monthly_trends && borrowingAnalytics.monthly_trends.length > 0 && (
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
                        Statistiques mensuelles des emprunts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <BorrowingStatsChart data={analyticsService.formatBorrowingStatsData(borrowingAnalytics.monthly_trends)} />
                    </CardContent>
                  </Card>
                )}

                {/* Statistiques supplémentaires */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <Star className="h-8 w-8 text-yellow-500" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Note moyenne</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {analyticsData?.overview?.average_rating && typeof analyticsData.overview.average_rating === 'number' 
                              ? analyticsData.overview.average_rating.toFixed(1) 
                              : 'N/A'}
                          </p>
                          <p className="text-xs text-gray-500">Sur {analyticsData?.overview?.total_reviews || 0} avis</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <TrendingUp className="h-8 w-8 text-green-500" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Croissance mensuelle</p>
                          <p className="text-2xl font-bold text-gray-900">
                            +{analyticsData?.trends?.borrowings_growth || 0}%
                          </p>
                          <p className="text-xs text-gray-500">Emprunts ce mois</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <Clock className="h-8 w-8 text-blue-500" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Heure de pointe</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {analyticsData?.peak_hours && analyticsData.peak_hours.length > 0 ? 
                              `${analyticsData.peak_hours[0].hour}h` : 'N/A'
                            }
                          </p>
                          <p className="text-xs text-gray-500">Activité maximale</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : (
              <Card className="p-8 text-center">
                <p className="text-gray-600">Aucune donnée analytics disponible</p>
                <Button 
                  onClick={fetchAnalyticsData} 
                  className="mt-4"
                  variant="outline"
                >
                  Charger les analytics
                </Button>
              </Card>
            )}
          </div>
        )}

        {/* Gestion des livres */}
        {activeTab === 'books' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Gestion des livres</h2>
              <Button
                onClick={() => setShowAddBookModal(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un livre
              </Button>
            </div>

            {booksLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Chargement des livres...</p>
              </div>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Livre
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Genre
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Année
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quantité
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {(() => {
                         return books.map((book, index) => {
                          return (
                          <tr key={book.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{book.title}</div>
                                <div className="text-sm text-gray-500">{book.author}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {book.genre}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {book.publication_year}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {book.available_quantity || 0}/{book.total_quantity || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewBookDetails(book)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Détails
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedBook(book)
                                  setNewBook({
                                    title: book.title || '',
                                    author: book.author || '',
                                    genre: book.genre || '',
                                    isbn: book.isbn || '',
                                    publication_year: book.publication_year || '',
                                    total_quantity: book.total_quantity || 1,
                                    description: book.description || ''
                                  })
                                  setCoverImageFile(null)
                                  setCoverImagePreview(null)
                                  setShowEditBookModal(true)
                                }}
                              >
                                <Settings className="h-4 w-4 mr-1" />
                                Modifier
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteBook(book.id)}
                              >
                                Supprimer
                              </Button>
                            </td>
                          </tr>
                          )
                        })
                        })()}
                        {books.length === 0 && (
                          <tr>
                            <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                              {booksLoading ? 'Chargement...' : 'Aucun livre trouvé. Ajoutez votre premier livre !'}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Gestion des utilisateurs */}
        {activeTab === 'users' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Gestion des utilisateurs</h2>
              <Button
                onClick={() => setShowAddUserModal(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un utilisateur
              </Button>
            </div>

            {usersLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Chargement des utilisateurs...</p>
              </div>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Utilisateur
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Rôle
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Statut
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date d'inscription
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user, index) => {
                          console.log(`Rendu utilisateur ${index}:`, user)
                          return (
                            <tr key={user.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10">
                                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                      <Users className="h-5 w-5 text-gray-600" />
                                    </div>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                    <div className="text-sm text-gray-500">ID: {user.id}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {user.email}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  user.role === 'admin' 
                                    ? 'bg-purple-100 text-purple-800' 
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {user.role === 'admin' ? 'Administrateur' : 'Étudiant'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  user.is_active 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {user.is_active ? 'Actif' : 'Inactif'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatDate(user.created_at)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedUser(user)
                                    fetchUserDetails(user.id)
                                    setShowUserDetailsModal(true)
                                  }}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Détails
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedUser(user)
                                    setNewUser({
                                      name: user.name,
                                      email: user.email,
                                      password: '',
                                      role: user.role
                                    })
                                    setShowEditUserModal(true)
                                  }}
                                >
                                  Modifier
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDeleteUser(user.id)}
                                >
                                  Supprimer
                                </Button>
                              </td>
                            </tr>
                          )
                        })}
                        {users.length === 0 && (
                          <tr>
                            <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                              {usersLoading ? 'Chargement...' : 'Aucun utilisateur trouvé.'}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'borrowings' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Gestion des emprunts</h2>
              <Button
                onClick={() => {
                  fetchBorrowings()
                  toast({
                    title: "Actualisation",
                    description: "Liste des emprunts mise à jour"
                  })
                }}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Actualiser</span>
              </Button>
            </div>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total emprunts</p>
                      <p className="text-2xl font-bold text-gray-900">{borrowingsStats?.total || borrowings.length}</p>
                      <p className="text-xs text-gray-500">Tous les emprunts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Clock className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Emprunts actifs</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {borrowings.filter(b => b.current_status === 'active').length}
                      </p>
                      <p className="text-xs text-gray-500">En cours</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">En retard</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {borrowings.filter(b => b.current_status === 'overdue').length}
                      </p>
                      <p className="text-xs text-gray-500">Dépassent la date limite</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {borrowingsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Chargement des emprunts...</p>
              </div>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Utilisateur
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Livre
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date d'emprunt
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date limite
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Statut
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date de retour
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {(() => {
                         console.log('=== AFFICHAGE DES EMPRUNTS ===')
                         console.log('borrowings array:', borrowings)
                         console.log('borrowings.length:', borrowings.length)
                         return borrowings.map((borrowing, index) => {
                          console.log(`Emprunt ${index}:`, borrowing)
                          return (
                          <tr key={borrowing.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{borrowing.user_name}</div>
                                <div className="text-sm text-gray-500">{borrowing.user_email}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{borrowing.title}</div>
                                <div className="text-sm text-gray-500">par {borrowing.author}</div>
                                {borrowing.isbn && (
                                  <div className="text-xs text-gray-400">ISBN: {borrowing.isbn}</div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatDate(borrowing.borrowed_at)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatDate(borrowing.due_date)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(borrowing)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {borrowing.returned_at ? formatDate(borrowing.returned_at) : '-'}
                            </td>
                          </tr>
                          )
                        })
                        })()}
                        {borrowings.length === 0 && (
                          <tr>
                            <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                              {borrowingsLoading ? 'Chargement...' : 'Aucun emprunt trouvé.'}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Pagination (si nécessaire) */}
            {borrowingsStats && borrowingsStats.totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">
                    Page {borrowingsStats.page} sur {borrowingsStats.totalPages} 
                    ({borrowingsStats.total} emprunts au total)
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal d'ajout d'utilisateur */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Ajouter un utilisateur</h3>
              <button
                onClick={() => {
                  setShowAddUserModal(false)
                  setNewUser({
                    name: '',
                    email: '',
                    password: '',
                    role: 'student'
                  })
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleAddUser(newUser)
              }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Nom et prénom"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="adresse@email.com"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe <span className="text-red-500">*</span>
                </label>
                <Input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="Minimum 6 caractères"
                  required
                  minLength={6}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rôle <span className="text-red-500">*</span>
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'student' | 'admin' })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="student">Étudiant</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddUserModal(false)
                    setNewUser({
                      name: '',
                      email: '',
                      password: '',
                      role: 'student'
                    })
                  }}
                  className="px-6 py-2"
                >
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 px-8 py-2"
                >
                  Ajouter l'utilisateur
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de modification d'utilisateur */}
      {showEditUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Modifier l'utilisateur</h3>
              <button
                onClick={() => {
                  setShowEditUserModal(false)
                  setSelectedUser(null)
                  setNewUser({
                    name: '',
                    email: '',
                    password: '',
                    role: 'student'
                  })
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleEditUser({
                  name: newUser.name,
                  email: newUser.email,
                  role: newUser.role,
                  is_active: selectedUser.is_active
                })
              }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Nom et prénom"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="adresse@email.com"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rôle <span className="text-red-500">*</span>
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'student' | 'admin' })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="student">Étudiant</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedUser.is_active}
                    onChange={(e) => setSelectedUser({ ...selectedUser, is_active: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">Compte actif</span>
                </label>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowEditUserModal(false)
                    setSelectedUser(null)
                    setNewUser({
                      name: '',
                      email: '',
                      password: '',
                      role: 'student'
                    })
                  }}
                  className="px-6 py-2"
                >
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 px-8 py-2"
                >
                  Modifier l'utilisateur
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal des détails d'utilisateur */}
      {showUserDetailsModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Détails de l'utilisateur</h3>
              <button
                onClick={() => {
                  setShowUserDetailsModal(false)
                  setSelectedUser(null)
                  setUserStats(null)
                  setUserBorrowings([])
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Informations de base */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Nom :</span>
                    <p className="text-sm text-gray-900">{selectedUser.name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Email :</span>
                    <p className="text-sm text-gray-900">{selectedUser.email}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Rôle :</span>
                    <p className="text-sm text-gray-900">
                      {selectedUser.role === 'admin' ? 'Administrateur' : 'Étudiant'}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Statut :</span>
                    <p className="text-sm text-gray-900">
                      {selectedUser.is_active ? 'Actif' : 'Inactif'}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Inscription :</span>
                    <p className="text-sm text-gray-900">{formatDate(selectedUser.created_at)}</p>
                  </div>
                </div>
              </div>

              {/* Statistiques */}
              {userStats && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Statistiques</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center">
                          <FileText className="h-8 w-8 text-blue-600" />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-600">Emprunts actifs</p>
                            <p className="text-xl font-bold text-gray-900">{userStats.active_borrowings}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center">
                          <CheckCircle className="h-8 w-8 text-green-600" />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-600">Total emprunts</p>
                            <p className="text-xl font-bold text-gray-900">{userStats.total_borrowed}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center">
                          <AlertTriangle className="h-8 w-8 text-red-600" />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-600">En retard</p>
                            <p className="text-xl font-bold text-gray-900">{userStats.overdue_books}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Historique des emprunts */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Historique des emprunts</h4>
                {userBorrowings.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Livre</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Emprunté le</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date limite</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {userBorrowings.slice(0, 5).map((borrowing) => (
                          <tr key={borrowing.id}>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{borrowing.title}</div>
                              <div className="text-sm text-gray-500">par {borrowing.author}</div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatDate(borrowing.borrowed_at)}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatDate(borrowing.due_date)}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              {getStatusBadge(borrowing)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {userBorrowings.length > 5 && (
                      <p className="text-sm text-gray-500 mt-2 text-center">
                        Et {userBorrowings.length - 5} autres emprunts...
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">Aucun historique d'emprunt</p>
                )}
              </div>

              <div className="flex justify-end pt-6 border-t border-gray-200">
                <Button
                  onClick={() => {
                    setShowUserDetailsModal(false)
                    setSelectedUser(null)
                    setUserStats(null)
                    setUserBorrowings([])
                  }}
                  className="px-6 py-2"
                >
                  Fermer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'ajout de livre */}
      {showAddBookModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Ajouter un livre</h3>
              <button
                onClick={() => {
                  setShowAddBookModal(false)
                  setCoverImageFile(null)
                  setCoverImagePreview(null)
                  setNewBook({
                    title: '',
                    author: '',
                    genre: '',
                    isbn: '',
                    publication_year: '',
                    total_quantity: 1,
                    description: ''
                  })
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleAddBook(newBook)
              }}
              className="space-y-6"
            >
              {/* Ligne 1: Informations principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={newBook.title}
                    onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                    placeholder="Titre du livre"
                    required
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">Maximum 200 caractères</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Auteur <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={newBook.author}
                    onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                    placeholder="Nom de l'auteur"
                    required
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">Maximum 150 caractères</p>
                </div>
              </div>

              {/* Ligne 2: Genre et ISBN */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Genre
                  </label>
                  <Input
                    type="text"
                    value={newBook.genre}
                    onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
                    placeholder="Ex: Fiction, Science-fiction, Histoire..."
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">Maximum 50 caractères (optionnel)</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ISBN
                  </label>
                  <Input
                    type="text"
                    value={newBook.isbn}
                    onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                    placeholder="Ex: 978-2-123456-78-9"
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">Maximum 20 caractères (optionnel)</p>
                </div>
              </div>

              {/* Ligne 3: Année et Quantité */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Année de publication <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={newBook.publication_year}
                    onChange={(e) => setNewBook({ ...newBook, publication_year: e.target.value })}
                    placeholder="Ex: 2024"
                    min="1901"
                    max="2155"
                    required
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">Entre 1901 et 2155</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantité totale <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={newBook.total_quantity}
                    onChange={(e) => setNewBook({ ...newBook, total_quantity: parseInt(e.target.value) })}
                    placeholder="Ex: 5"
                    min="0"
                    max="1000"
                    required
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">Entre 0 et 1000 exemplaires</p>
                </div>
              </div>

              {/* Ligne 4: Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  value={newBook.description}
                  onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                  placeholder="Description du livre, résumé..."
                  maxLength={5000}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Maximum 5000 caractères (optionnel) - {newBook.description.length}/5000
                </p>
              </div>

              {/* Image de couverture */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image de couverture
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setCoverImageFile(file)
                          const reader = new FileReader()
                          reader.onload = (e) => {
                            setCoverImagePreview(e.target?.result as string)
                          }
                          reader.readAsDataURL(file)
                        }
                      }}
                      className="hidden"
                      id="cover-image-upload"
                    />
                    <label
                      htmlFor="cover-image-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      {coverImagePreview ? (
                        <div className="mb-4">
                          <img
                            src={coverImagePreview}
                            alt="Aperçu"
                            className="h-32 w-24 object-cover rounded-lg shadow-md"
                          />
                        </div>
                      ) : (
                        <div className="mb-4">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      )}
                      <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                        {coverImagePreview ? 'Changer l\'image' : 'Choisir une image'}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        PNG, JPG, JPEG jusqu'à 5MB
                      </span>
                    </label>
                    {coverImagePreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setCoverImageFile(null)
                          setCoverImagePreview(null)
                        }}
                        className="mt-2 text-sm text-red-600 hover:text-red-500"
                      >
                        Supprimer l'image
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Optionnel - Format recommandé: 300x450px</p>
              </div>

              {/* Boutons d'action */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddBookModal(false)
                    setCoverImageFile(null)
                    setCoverImagePreview(null)
                    setNewBook({
                      title: '',
                      author: '',
                      genre: '',
                      isbn: '',
                      publication_year: '',
                      total_quantity: 1,
                      description: ''
                    })
                  }}
                  className="px-6 py-2"
                >
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 px-8 py-2"
                >
                  Ajouter le livre
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de modification de livre */}
      {showEditBookModal && selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Modifier le livre</h3>
              <button
                onClick={() => {
                  setShowEditBookModal(false)
                  setSelectedBook(null)
                  setCoverImageFile(null)
                  setCoverImagePreview(null)
                  setNewBook({
                    title: '',
                    author: '',
                    genre: '',
                    isbn: '',
                    publication_year: '',
                    total_quantity: 1,
                    description: ''
                  })
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleEditBook(newBook)
              }}
              className="space-y-6"
            >
              {/* Ligne 1: Informations principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={newBook.title}
                    onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                    placeholder="Titre du livre"
                    required
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">Maximum 200 caractères</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Auteur <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={newBook.author}
                    onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                    placeholder="Nom de l'auteur"
                    required
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">Maximum 150 caractères</p>
                </div>
              </div>

              {/* Ligne 2: Genre et ISBN */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Genre
                  </label>
                  <Input
                    type="text"
                    value={newBook.genre}
                    onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
                    placeholder="Ex: Fiction, Science-fiction, Histoire..."
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">Maximum 50 caractères (optionnel)</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ISBN
                  </label>
                  <Input
                    type="text"
                    value={newBook.isbn}
                    onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                    placeholder="Ex: 978-2-123456-78-9"
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">Maximum 20 caractères (optionnel)</p>
                </div>
              </div>

              {/* Ligne 3: Année et Quantité */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Année de publication <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={newBook.publication_year}
                    onChange={(e) => setNewBook({ ...newBook, publication_year: e.target.value })}
                    placeholder="Ex: 2024"
                    min="1901"
                    max="2155"
                    required
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">Entre 1901 et 2155</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantité totale <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={newBook.total_quantity}
                    onChange={(e) => setNewBook({ ...newBook, total_quantity: parseInt(e.target.value) })}
                    placeholder="Ex: 5"
                    min="0"
                    max="1000"
                    required
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">Entre 0 et 1000 exemplaires</p>
                </div>
              </div>

              {/* Ligne 4: Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  value={newBook.description || ''}
                  onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                  placeholder="Description du livre, résumé..."
                  maxLength={5000}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Maximum 5000 caractères (optionnel) - {(newBook.description || '').length}/5000
                </p>
              </div>

              {/* Image de couverture */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image de couverture
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setCoverImageFile(file)
                          const reader = new FileReader()
                          reader.onload = (e) => {
                            setCoverImagePreview(e.target?.result as string)
                          }
                          reader.readAsDataURL(file)
                        }
                      }}
                      className="hidden"
                      id="edit-cover-image-upload"
                    />
                    <label
                      htmlFor="edit-cover-image-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      {coverImagePreview || selectedBook.cover_image ? (
                        <div className="mb-4">
                          <img
                            src={coverImagePreview || selectedBook.cover_image}
                            alt="Aperçu"
                            className="h-32 w-24 object-cover rounded-lg shadow-md"
                          />
                        </div>
                      ) : (
                        <div className="mb-4">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      )}
                      <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                        {(coverImagePreview || selectedBook.cover_image) ? 'Changer l\'image' : 'Choisir une image'}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        PNG, JPG, JPEG jusqu'à 5MB
                      </span>
                    </label>
                    {(coverImagePreview || selectedBook.cover_image) && (
                      <button
                        type="button"
                        onClick={() => {
                          setCoverImageFile(null)
                          setCoverImagePreview(null)
                        }}
                        className="mt-2 text-sm text-red-600 hover:text-red-500"
                      >
                        {coverImagePreview ? 'Supprimer la nouvelle image' : 'Supprimer l\'image actuelle'}
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {selectedBook.cover_image && !coverImagePreview 
                    ? 'Image actuelle - Choisissez une nouvelle image pour la remplacer' 
                    : 'Optionnel - Format recommandé: 300x450px'
                  }
                </p>
              </div>

              {/* Boutons d'action */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowEditBookModal(false)
                    setSelectedBook(null)
                    setCoverImageFile(null)
                    setCoverImagePreview(null)
                    setNewBook({
                      title: '',
                      author: '',
                      genre: '',
                      isbn: '',
                      publication_year: '',
                      total_quantity: 1,
                      description: ''
                    })
                  }}
                  className="px-6 py-2"
                >
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 px-8 py-2"
                >
                  Modifier le livre
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal des détails d'un livre */}
      {selectedBook && (
        <EnhancedBookDetailsModal
          book={selectedBook}
          isOpen={showBookDetailsModal}
          onClose={() => {
            setShowBookDetailsModal(false)
            setSelectedBook(null)
          }}
          onEdit={() => {
            setNewBook({
              title: selectedBook.title || '',
              author: selectedBook.author || '',
              genre: selectedBook.genre || '',
              isbn: selectedBook.isbn || '',
              publication_year: selectedBook.publication_year || '',
              total_quantity: selectedBook.total_quantity || 1,
              description: selectedBook.description || ''
            })
            setCoverImageFile(null)
            setCoverImagePreview(null)
            setShowBookDetailsModal(false)
            setShowEditBookModal(true)
          }}
          onDelete={() => {
            setShowBookDetailsModal(false)
            handleDeleteBook(selectedBook.id)
          }}
        />
      )}
    </div>
  )
}

export default AdminDashboard
