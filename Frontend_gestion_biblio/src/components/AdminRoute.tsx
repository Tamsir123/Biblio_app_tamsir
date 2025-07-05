import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'

interface AdminRouteProps {
  children: React.ReactNode
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    const checkAdminAccess = () => {
      const token = localStorage.getItem('token')
      const userStr = localStorage.getItem('user')
      
      console.log('AdminRoute - Vérification accès...')
      console.log('Token présent:', !!token)
      console.log('User data:', userStr)
      
      if (!token || !userStr) {
        console.log('AdminRoute - Pas de token ou données utilisateur')
        toast({
          title: "Accès refusé",
          description: "Vous devez être connecté pour accéder à cette page",
          variant: "destructive"
        })
        navigate('/login')
        return
      }

      try {
        const user = JSON.parse(userStr)
        console.log('AdminRoute - Rôle utilisateur:', user.role)
        
        if (user.role !== 'admin') {
          console.log('AdminRoute - Utilisateur non admin')
          toast({
            title: "Accès refusé",
            description: "Vous n'avez pas les permissions d'administrateur",
            variant: "destructive"
          })
          navigate('/')
          return
        }
        
        console.log('AdminRoute - Accès admin autorisé')
        setIsAuthorized(true)
      } catch (error) {
        console.error('AdminRoute - Erreur parsing user data:', error)
        navigate('/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAdminAccess()
  }, [navigate, toast])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Vérification des permissions...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null // Le useEffect gère la redirection
  }

  return <>{children}</>
}

export default AdminRoute
