import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('Tentative de connexion avec:', { email: formData.email });
      
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Réponse reçue:', response.status, response.statusText);
      
      const data = await response.json();
      console.log('Données reçues:', data);

      if (response.ok) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        
        console.log('Utilisateur connecté:', data.data.user);
        console.log('Rôle de l\'utilisateur:', data.data.user.role);
        
        // Déclencher un événement pour informer la navbar
        window.dispatchEvent(new Event('storage'));
        
        // Redirection basée sur le rôle
        if (data.data.user.role === 'admin') {
          console.log('Redirection vers /admin...');
          navigate('/admin');
        } else {
          console.log('Redirection vers / (accueil)...');
          navigate('/');
        }
      } else {
        setError(data.message || 'Erreur de connexion');
      }
    } catch (err) {
      console.error('Erreur de connexion:', err);
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('Impossible de se connecter au serveur. Vérifiez que le backend est démarré sur le port 5000.');
      } else {
        setError('Erreur de connexion au serveur');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <motion.div 
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-black"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/70 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=800&fit=crop" 
          alt="Bibliothèque" 
          className="w-full h-full object-cover"
        />
        
        {/* Overlay Content */}
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <motion.div 
            className="text-center text-white px-8"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h1 className="text-3xl font-light mb-3">Bibliothèque 2iE</h1>
            <div className="w-16 h-0.5 bg-white mx-auto mb-3"></div>
            <p className="text-base font-light opacity-90">
              Votre espace numérique d'apprentissage
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Login Form */}
      <motion.div 
        className="w-full lg:w-1/2 flex items-center justify-center bg-white p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-sm w-full">
          {/* Close Button */}
          <div className="flex justify-end mb-6">
            <Link 
              to="/" 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </Link>
          </div>

          {/* Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h2 className="text-2xl font-light text-black mb-2">Connexion</h2>
            <div className="w-10 h-0.5 bg-black mx-auto"></div>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div 
              className="mb-4 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.div>
          )}

          {/* Login Form */}
          <motion.form 
            onSubmit={handleSubmit} 
            className="space-y-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {/* Email Field */}
            <div className="space-y-1">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 h-10 border-gray-300 focus:border-black focus:ring-0 rounded-none bg-gray-50 focus:bg-white transition-colors text-sm"
                  placeholder="Adresse email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 h-10 border-gray-300 focus:border-black focus:ring-0 rounded-none bg-gray-50 focus:bg-white transition-colors text-sm"
                  placeholder="Mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center text-gray-600">
                <input
                  type="checkbox"
                  className="mr-2 rounded border-gray-300 text-black focus:ring-0"
                />
                Se souvenir de moi
              </label>
              <Link
                to="/forgot-password"
                className="text-gray-600 hover:text-black transition-colors"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 bg-black hover:bg-gray-800 text-white font-normal rounded-none transition-all duration-200 text-sm"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Connexion...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  Se connecter
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              )}
            </Button>
          </motion.form>

          {/* Sign Up Link */}
          <motion.div 
            className="text-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <p className="text-gray-600 text-sm">
              Pas encore de compte ?{' '}
              <Link
                to="/inscription"
                className="text-black hover:underline font-medium"
              >
                Créer un compte
              </Link>
            </p>
          </motion.div>

          {/* Demo Info */}
          <motion.div 
            className="mt-12 p-4 bg-gray-50 text-center text-xs text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <p><strong>Demo Admin :</strong> admin@biblio.com / AdminPass123</p>
            <p><strong>Demo Étudiant :</strong> john.doe@example.com / Password123</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
