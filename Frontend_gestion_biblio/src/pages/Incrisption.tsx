import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff, Lock, Mail, User, X, ArrowRight } from 'lucide-react';

const Inscription = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleRoleChange = (value: string) => {
    setFormData({
      ...formData,
      role: value
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Le nom complet est requis');
      return false;
    }
    if (!formData.email.trim()) {
      setError('L\'adresse email est requise');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Veuillez entrer une adresse email valide');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Compte créé avec succès !');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.message || 'Erreur lors de la création du compte');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
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
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop" 
          alt="Bibliothèque Moderne" 
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
            <h1 className="text-3xl font-light mb-3">Rejoignez-nous</h1>
            <div className="w-16 h-0.5 bg-white mx-auto mb-3"></div>
            <p className="text-base font-light opacity-90">
              Créez votre compte et accédez à nos ressources
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Register Form */}
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
            <h2 className="text-2xl font-light text-black mb-2">Inscription</h2>
            <div className="w-10 h-0.5 bg-black mx-auto"></div>
          </motion.div>

          {/* Success Message */}
          {success && (
            <motion.div 
              className="mb-4 p-2 bg-green-50 border border-green-200 rounded text-green-700 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {success}
            </motion.div>
          )}

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

          {/* Register Form */}
          <motion.form 
            onSubmit={handleSubmit} 
            className="space-y-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {/* Name Field */}
            <div className="space-y-1">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="pl-10 h-10 border-gray-300 focus:border-black focus:ring-0 rounded-none bg-gray-50 focus:bg-white transition-colors text-sm"
                  placeholder="Nom complet"
                />
              </div>
            </div>

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

            {/* Role Selection */}
            <div className="space-y-1">
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger className="h-10 border-gray-300 focus:border-black focus:ring-0 rounded-none bg-gray-50 focus:bg-white text-sm">
                  <SelectValue placeholder="Type de compte" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Étudiant</SelectItem>
                  <SelectItem value="admin">Administrateur</SelectItem>
                </SelectContent>
              </Select>
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

            {/* Confirm Password Field */}
            <div className="space-y-1">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 h-10 border-gray-300 focus:border-black focus:ring-0 rounded-none bg-gray-50 focus:bg-white transition-colors text-sm"
                  placeholder="Confirmer le mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start text-xs">
              <input
                type="checkbox"
                required
                className="mr-2 mt-1 rounded border-gray-300 text-black focus:ring-0"
              />
              <span className="text-gray-600">
                J'accepte les conditions d'utilisation
              </span>
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
                  Création...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  Créer mon compte
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              )}
            </Button>
          </motion.form>

          {/* Login Link */}
          <motion.div 
            className="text-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <p className="text-gray-600 text-sm">
              Vous avez déjà un compte ?{' '}
              <Link
                to="/login"
                className="text-black hover:underline font-medium"
              >
                Se connecter
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Inscription;