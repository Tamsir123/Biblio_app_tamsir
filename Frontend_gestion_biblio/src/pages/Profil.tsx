import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  User, Mail, Phone, MapPin, Calendar, GraduationCap, 
  Building, Globe, Heart, BookOpen, Star, Settings, 
  Edit3, Save, X, Camera, Shield, Bell, Palette, 
  MessageSquare, TrendingUp, Award, Clock, Target
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'

interface UserProfile {
  id: number
  name: string
  email: string
  role: string
}

interface UserStats {
  active_borrowings: number
  total_borrowed: number
  overdue_books: number
  reviews_given: number
  average_rating_given: number | null
}

const Profil = () => {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  // Récupérer le token JWT (localStorage ou cookie)
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) {
      setError('Vous devez être connecté pour accéder au profil.')
      setLoading(false)
      return
    }
    fetchProfile()
  }, [token])

  const fetchProfile = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('http://localhost:5000/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.message || 'Erreur')
      setUser(data.data.user)
      setStats(data.data.stats)
      setName(data.data.user.name)
      setEmail(data.data.user.email)
    } catch (e: any) {
      setError(e.message || 'Erreur lors du chargement du profil')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccessMsg('')
    try {
      const res = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, email })
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.message || 'Erreur')
      setSuccessMsg('Profil mis à jour !')
      setEditMode(false)
      fetchProfile()
    } catch (e: any) {
      setError(e.message || 'Erreur lors de la mise à jour')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-black mx-auto mb-8"></div>
            <p className="text-xl text-gray-600">Chargement du profil...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center text-red-600">{error}</div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <h1 className="text-3xl font-light mb-8">Mon profil</h1>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            {editMode ? (
              <Input value={name} onChange={e => setName(e.target.value)} />
            ) : (
              <div className="text-lg">{user?.name}</div>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            {editMode ? (
              <Input value={email} onChange={e => setEmail(e.target.value)} />
            ) : (
              <div className="text-lg">{user?.email}</div>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
            <div className="text-lg">{user?.role}</div>
          </div>
          {editMode ? (
            <div className="flex gap-2 mt-4">
              <Button onClick={handleSave} disabled={saving}>{saving ? 'Enregistrement...' : 'Enregistrer'}</Button>
              <Button variant="outline" onClick={() => setEditMode(false)} disabled={saving}>Annuler</Button>
            </div>
          ) : (
            <Button className="mt-4" onClick={() => setEditMode(true)}>Modifier</Button>
          )}
          {successMsg && <div className="text-green-600 mt-2">{successMsg}</div>}
        </div>
        {stats && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-light mb-4">Statistiques</h2>
            <ul className="text-gray-700 space-y-2">
              <li>Emprunts actifs : <span className="font-medium">{stats.active_borrowings}</span></li>
              <li>Total empruntés : <span className="font-medium">{stats.total_borrowed}</span></li>
              <li>Retards : <span className="font-medium">{stats.overdue_books}</span></li>
              <li>Avis donnés : <span className="font-medium">{stats.reviews_given}</span></li>
              <li>Note moyenne donnée : <span className="font-medium">{stats.average_rating_given !== null ? stats.average_rating_given.toFixed(2) : 'N/A'}</span></li>
            </ul>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default Profil
