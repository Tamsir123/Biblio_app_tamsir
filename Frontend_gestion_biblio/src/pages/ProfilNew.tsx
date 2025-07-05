import { useState, useEffect, useCallback, useRef } from 'react'
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
  student_id: string
  phone: string
  address: string
  date_of_birth: string
  department: string
  level: string
  country: string
  city: string
  emergency_contact_name: string
  emergency_contact_phone: string
  bio: string
  favorite_genres: string
  profile_image: string
  last_login_at: string
  created_at: string
  // Préférences
  notification_email: boolean
  notification_sms: boolean
  language: string
  theme: string
  privacy_profile: string
  receive_recommendations: boolean
}

interface UserStats {
  active_borrowings: number
  total_returned: number
  total_borrowings: number
  total_reviews: number
  avg_rating_given: number | null
  logins_last_30_days: number
}

const ProfilNew = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'security'>('profile')
  const [formData, setFormData] = useState<Partial<UserProfile>>({})
  const [uploadingImage, setUploadingImage] = useState(false)
  const { toast } = useToast()

  const token = localStorage.getItem('token')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchProfile = useCallback(async () => {
    if (!token) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour accéder au profil",
        variant: "destructive"
      })
      setLoading(false)
      return
    }

    try {
      const response = await fetch('http://localhost:5000/api/user/profile', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(data.data.profile)
        setStats(data.data.stats)
        setFormData(data.data.profile)
      } else {
        throw new Error('Erreur lors de la récupération du profil')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger le profil",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }, [token, toast])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('http://localhost:5000/api/user/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchProfile()
        setEditMode(false)
        toast({
          title: "Succès",
          description: "Profil mis à jour avec succès",
        })
      } else {
        throw new Error('Erreur lors de la mise à jour')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour du profil",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData(profile || {})
    setEditMode(false)
  }

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier image valide",
        variant: "destructive"
      })
      return
    }

    // Vérifier la taille du fichier (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erreur",
        description: "L'image ne doit pas dépasser 5 MB",
        variant: "destructive"
      })
      return
    }

    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('profile_image', file)

      const response = await fetch('http://localhost:5000/api/user/profile/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        await fetchProfile() // Recharger le profil pour obtenir la nouvelle image
        toast({
          title: "Succès",
          description: "Photo de profil mise à jour avec succès",
        })
      } else {
        throw new Error('Erreur lors du téléchargement')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast({
        title: "Erreur",
        description: "Erreur lors du téléchargement de l'image",
        variant: "destructive"
      })
    } finally {
      setUploadingImage(false)
      // Réinitialiser l'input file
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const triggerImageUpload = () => {
    fileInputRef.current?.click()
  }

  const getProfileImage = () => {
    if (profile?.profile_image) {
      return profile.profile_image.startsWith('/') 
        ? `http://localhost:5000${profile.profile_image}`
        : profile.profile_image
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || 'User')}&size=200&background=3b82f6&color=ffffff&bold=true`
  }

  const getLevelBadgeColor = (level: string) => {
    const colors = {
      'L1': 'bg-green-100 text-green-800',
      'L2': 'bg-blue-100 text-blue-800',
      'L3': 'bg-purple-100 text-purple-800',
      'M1': 'bg-orange-100 text-orange-800',
      'M2': 'bg-red-100 text-red-800',
      'PhD': 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
    }
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800'
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
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-8"></div>
            <p className="text-xl text-gray-600">Chargement de votre profil...</p>
          </motion.div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center py-12">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Profil non trouvé</h3>
              <p className="text-gray-600">Impossible de charger vos informations</p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section avec photo de profil */}
      <motion.div 
        className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 h-[60vh] flex items-center justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0">
          {/* Pattern géométrique moderne */}
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M0 0h40v40H0zm40 40h40v40H40z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '80px 80px'
          }}></div>
          {/* Gradient overlay pour profondeur */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/30"></div>
          {/* Pattern de grille subtile */}
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-16">
          <motion.div 
            className="flex flex-col items-center text-center"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="relative mb-6 group">
              <motion.img
                src={getProfileImage()}
                alt={profile.name}
                className="w-32 h-32 rounded-full border-4 border-white shadow-2xl object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              />
              
              {/* Overlay au hover */}
              <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <span className="text-white text-sm font-medium">Changer</span>
              </div>
              
              <motion.button
                onClick={triggerImageUpload}
                disabled={uploadingImage}
                className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-200 disabled:opacity-50 hover:bg-gray-50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title="Changer la photo de profil"
              >
                {uploadingImage ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                ) : (
                  <Camera className="w-4 h-4 text-gray-700" />
                )}
              </motion.button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              {uploadingImage && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto mb-2"></div>
                    <span className="text-xs">Upload...</span>
                  </div>
                </div>
              )}
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-2">{profile.name}</h1>
            <p className="text-xl text-gray-200 mb-2">{profile.email}</p>
            <div className="flex items-center space-x-4 mb-4">
              <Badge className={`${getLevelBadgeColor(profile.level)} border-0`}>
                <GraduationCap className="w-3 h-3 mr-1" />
                {profile.level}
              </Badge>
              <Badge className="bg-white/90 text-gray-800 border-0 backdrop-blur-sm">
                <Building className="w-3 h-3 mr-1" />
                {profile.department}
              </Badge>
              <Badge className="bg-white/90 text-gray-800 border-0 backdrop-blur-sm">
                ID: {profile.student_id}
              </Badge>
            </div>
            
            {profile.bio && (
              <p className="text-gray-200 max-w-2xl">{profile.bio}</p>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Statistiques */}
      <motion.div 
        className="container mx-auto px-4 -mt-8 relative z-10"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: BookOpen, label: 'Emprunts actifs', value: stats?.active_borrowings || 0, color: 'text-blue-600' },
            { icon: TrendingUp, label: 'Total emprunts', value: stats?.total_borrowings || 0, color: 'text-green-600' },
            { icon: Award, label: 'Livres retournés', value: stats?.total_returned || 0, color: 'text-purple-600' },
            { icon: Star, label: 'Avis donnés', value: stats?.total_reviews || 0, color: 'text-yellow-600' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center"
              whileHover={{ y: -2, shadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.3 }}
            >
              <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-xs text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Navigation par onglets */}
      <div className="container mx-auto px-4">
        <div className="flex space-x-1 bg-white rounded-2xl p-1 shadow-sm border border-gray-100 mb-8">
          {[
            { id: 'profile', label: 'Profil', icon: User },
            { id: 'preferences', label: 'Préférences', icon: Settings },
            { id: 'security', label: 'Sécurité', icon: Shield }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Contenu des onglets */}
      <div className="container mx-auto px-4 pb-16">
        {activeTab === 'profile' && (
          <ProfileTab
            profile={profile}
            formData={formData}
            editMode={editMode}
            setEditMode={setEditMode}
            updateFormData={updateFormData}
            handleSave={handleSave}
            handleCancel={handleCancel}
            saving={saving}
          />
        )}
        
        {activeTab === 'preferences' && (
          <PreferencesTab
            profile={profile}
            formData={formData}
            updateFormData={updateFormData}
            handleSave={handleSave}
            saving={saving}
          />
        )}
        
        {activeTab === 'security' && (
          <SecurityTab />
        )}
      </div>

      <Footer />
    </div>
  )
}

// Composant onglet Profil
const ProfileTab = ({ 
  profile, formData, editMode, setEditMode, updateFormData, 
  handleSave, handleCancel, saving 
}: {
  profile: UserProfile
  formData: Partial<UserProfile>
  editMode: boolean
  setEditMode: (mode: boolean) => void
  updateFormData: (field: string, value: string) => void
  handleSave: () => void
  handleCancel: () => void
  saving: boolean
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Informations personnelles */}
        <div className="lg:col-span-2">
          <Card className="rounded-2xl border-0 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <span>Informations personnelles</span>
                </CardTitle>
                {!editMode ? (
                  <Button
                    onClick={() => setEditMode(true)}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Modifier
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleCancel}
                      size="sm"
                      variant="outline"
                      className="rounded-xl"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Annuler
                    </Button>
                    <Button
                      onClick={handleSave}
                      size="sm"
                      disabled={saving}
                      className="bg-green-600 hover:bg-green-700 text-white rounded-xl"
                    >
                      {saving ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Sauvegarder
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <User className="w-4 h-4 mr-2 text-gray-500" />
                    Nom complet
                  </label>
                  {editMode ? (
                    <Input
                      value={formData.name || ''}
                      onChange={(e) => updateFormData('name', e.target.value)}
                      className="rounded-xl border-gray-200"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{profile.name}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-500" />
                    Email
                  </label>
                  <p className="text-gray-900 py-2">{profile.email}</p>
                  <p className="text-xs text-gray-500">L'email ne peut pas être modifié</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    Téléphone
                  </label>
                  {editMode ? (
                    <Input
                      value={formData.phone || ''}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      className="rounded-xl border-gray-200"
                      placeholder="+226 XX XX XX XX"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{profile.phone || 'Non renseigné'}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                    Date de naissance
                  </label>
                  {editMode ? (
                    <Input
                      type="date"
                      value={formData.date_of_birth || ''}
                      onChange={(e) => updateFormData('date_of_birth', e.target.value)}
                      className="rounded-xl border-gray-200"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">
                      {profile.date_of_birth 
                        ? new Date(profile.date_of_birth).toLocaleDateString('fr-FR')
                        : 'Non renseigné'
                      }
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                  Adresse
                </label>
                {editMode ? (
                  <Textarea
                    value={formData.address || ''}
                    onChange={(e) => updateFormData('address', e.target.value)}
                    className="rounded-xl border-gray-200 min-h-[60px]"
                    placeholder="Votre adresse complète"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{profile.address || 'Non renseigné'}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Globe className="w-4 h-4 mr-2 text-gray-500" />
                    Pays
                  </label>
                  {editMode ? (
                    <Input
                      value={formData.country || ''}
                      onChange={(e) => updateFormData('country', e.target.value)}
                      className="rounded-xl border-gray-200"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{profile.country || 'Non renseigné'}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Building className="w-4 h-4 mr-2 text-gray-500" />
                    Ville
                  </label>
                  {editMode ? (
                    <Input
                      value={formData.city || ''}
                      onChange={(e) => updateFormData('city', e.target.value)}
                      className="rounded-xl border-gray-200"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{profile.city || 'Non renseigné'}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2 text-gray-500" />
                  Bio
                </label>
                {editMode ? (
                  <Textarea
                    value={formData.bio || ''}
                    onChange={(e) => updateFormData('bio', e.target.value)}
                    className="rounded-xl border-gray-200 min-h-[100px]"
                    placeholder="Parlez-nous de vous..."
                    maxLength={1000}
                  />
                ) : (
                  <p className="text-gray-900 py-2">{profile.bio || 'Aucune bio renseignée'}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Informations académiques et de contact d'urgence */}
        <div className="space-y-6">
          {/* Infos académiques */}
          <Card className="rounded-2xl border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-purple-600" />
                <span>Informations académiques</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Département</label>
                {editMode ? (
                  <Select
                    value={formData.department || ''}
                    onValueChange={(value) => updateFormData('department', value)}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Sélectionner un département" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Informatique">Informatique</SelectItem>
                      <SelectItem value="Génie Civil">Génie Civil</SelectItem>
                      <SelectItem value="Génie Électrique">Génie Électrique</SelectItem>
                      <SelectItem value="Télécommunications">Télécommunications</SelectItem>
                      <SelectItem value="Management">Management</SelectItem>
                      <SelectItem value="Autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-gray-900">{profile.department || 'Non renseigné'}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Niveau</label>
                {editMode ? (
                  <Select
                    value={formData.level || ''}
                    onValueChange={(value) => updateFormData('level', value)}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Sélectionner un niveau" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L1">Licence 1</SelectItem>
                      <SelectItem value="L2">Licence 2</SelectItem>
                      <SelectItem value="L3">Licence 3</SelectItem>
                      <SelectItem value="M1">Master 1</SelectItem>
                      <SelectItem value="M2">Master 2</SelectItem>
                      <SelectItem value="PhD">Doctorat</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-gray-900">{profile.level || 'Non renseigné'}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">ID Étudiant</label>
                <p className="text-gray-900 font-mono text-sm bg-gray-50 px-3 py-2 rounded-lg">
                  {profile.student_id}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact d'urgence */}
          <Card className="rounded-2xl border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-red-600" />
                <span>Contact d'urgence</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Nom</label>
                {editMode ? (
                  <Input
                    value={formData.emergency_contact_name || ''}
                    onChange={(e) => updateFormData('emergency_contact_name', e.target.value)}
                    className="rounded-xl border-gray-200"
                    placeholder="Nom du contact d'urgence"
                  />
                ) : (
                  <p className="text-gray-900">{profile.emergency_contact_name || 'Non renseigné'}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Téléphone</label>
                {editMode ? (
                  <Input
                    value={formData.emergency_contact_phone || ''}
                    onChange={(e) => updateFormData('emergency_contact_phone', e.target.value)}
                    className="rounded-xl border-gray-200"
                    placeholder="+226 XX XX XX XX"
                  />
                ) : (
                  <p className="text-gray-900">{profile.emergency_contact_phone || 'Non renseigné'}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Genres préférés */}
          <Card className="rounded-2xl border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-pink-600" />
                <span>Genres préférés</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {editMode ? (
                <Textarea
                  value={formData.favorite_genres || ''}
                  onChange={(e) => updateFormData('favorite_genres', e.target.value)}
                  className="rounded-xl border-gray-200 min-h-[80px]"
                  placeholder="Ex: Science-fiction, Histoire, Philosophie..."
                />
              ) : (
                <p className="text-gray-900">
                  {profile.favorite_genres || 'Aucun genre préféré renseigné'}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}

// Composant onglet Préférences
const PreferencesTab = ({ 
  profile, formData, updateFormData, handleSave, saving 
}: {
  profile: UserProfile
  formData: Partial<UserProfile>
  updateFormData: (field: string, value: string | boolean) => void
  handleSave: () => void
  saving: boolean
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="rounded-2xl border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-blue-600" />
              <span>Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Notifications par email</p>
                <p className="text-sm text-gray-600">Recevoir les notifications importantes par email</p>
              </div>
              <Switch
                checked={formData.notification_email ?? profile.notification_email}
                onCheckedChange={(checked) => updateFormData('notification_email', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Notifications SMS</p>
                <p className="text-sm text-gray-600">Recevoir les rappels urgents par SMS</p>
              </div>
              <Switch
                checked={formData.notification_sms ?? profile.notification_sms}
                onCheckedChange={(checked) => updateFormData('notification_sms', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Recommandations</p>
                <p className="text-sm text-gray-600">Recevoir des suggestions de livres personnalisées</p>
              </div>
              <Switch
                checked={formData.receive_recommendations ?? profile.receive_recommendations}
                onCheckedChange={(checked) => updateFormData('receive_recommendations', checked)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Palette className="w-5 h-5 text-purple-600" />
              <span>Apparence et langue</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">Thème</label>
              <Select
                value={formData.theme ?? profile.theme}
                onValueChange={(value) => updateFormData('theme', value)}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Clair</SelectItem>
                  <SelectItem value="dark">Sombre</SelectItem>
                  <SelectItem value="auto">Automatique</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">Langue</label>
              <Select
                value={formData.language ?? profile.language}
                onValueChange={(value) => updateFormData('language', value)}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">Confidentialité du profil</label>
              <Select
                value={formData.privacy_profile ?? profile.privacy_profile}
                onValueChange={(value) => updateFormData('privacy_profile', value)}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="friends">Amis seulement</SelectItem>
                  <SelectItem value="private">Privé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-xl"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Sauvegarde...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder les préférences
            </>
          )}
        </Button>
      </div>
    </motion.div>
  )
}

// Composant onglet Sécurité
const SecurityTab = () => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      })
      return
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive"
      })
      return
    }

    if (newPassword.length < 6) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/user/profile/password', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword
        })
      })

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Mot de passe modifié avec succès",
        })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        const data = await response.json()
        throw new Error(data.message || 'Erreur lors du changement de mot de passe')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors du changement de mot de passe",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="rounded-2xl border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span>Changer le mot de passe</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Mot de passe actuel
              </label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="rounded-xl border-gray-200"
                placeholder="Votre mot de passe actuel"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Nouveau mot de passe
              </label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="rounded-xl border-gray-200"
                placeholder="Nouveau mot de passe (min. 6 caractères)"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Confirmer le nouveau mot de passe
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="rounded-xl border-gray-200"
                placeholder="Confirmez le nouveau mot de passe"
              />
            </div>

            <Button
              onClick={handleChangePassword}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl mt-6"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Modification...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Changer le mot de passe
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-600">
              <Shield className="w-5 h-5" />
              <span>Zone de danger</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm text-red-800 mb-3">
                <strong>Supprimer mon compte</strong>
              </p>
              <p className="text-sm text-red-700 mb-4">
                Cette action est irréversible. Votre compte sera désactivé et vous ne pourrez plus accéder à vos données.
              </p>
              <Button
                variant="destructive"
                className="rounded-xl"
                onClick={() => {
                  // Implémentation de la suppression de compte
                  console.log('Suppression de compte')
                }}
              >
                Supprimer mon compte
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}

export default ProfilNew
