import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Eye, EyeOff, Lock, Mail, User, X, ArrowRight, Phone, MapPin, Building, GraduationCap, Calendar } from 'lucide-react';

const Inscription = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Étape 1 : Informations de base
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Étape 2 : Informations personnelles
    phone: '',
    address: '',
    date_of_birth: '',
    country: 'Burkina Faso',
    city: '',
    // Étape 3 : Informations académiques/professionnelles
    student_id: '',
    department: '',
    level: '',
    bio: '',
    // Contacts d'urgence
    emergency_contact_name: '',
    emergency_contact_phone: ''
  });

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = () => {
    if (currentStep === 1) {
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
    }
    
    // Validation pour les autres étapes (optionnelle car les champs sont facultatifs)
    if (currentStep === 2) {
      if (formData.phone && !/^[+]?[\d\s-()]+$/.test(formData.phone)) {
        setError('Format de téléphone invalide');
        return false;
      }
      if (formData.date_of_birth) {
        const birthDate = new Date(formData.date_of_birth);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 13 || age > 120) {
          setError('Veuillez entrer une date de naissance valide');
          return false;
        }
      }
    }
    
    return true;
  };

  const nextStep = () => {
    if (validateForm()) {
      setCurrentStep(currentStep + 1);
      setError('');
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError('');

    try {
      // Préparer les données à envoyer (seulement les champs non vides)
      const dataToSend: Record<string, string> = {
        name: formData.name,
        email: formData.email,
        password: formData.password
      };

      // Ajouter les champs optionnels s'ils sont remplis
      if (formData.phone?.trim()) dataToSend.phone = formData.phone;
      if (formData.address?.trim()) dataToSend.address = formData.address;
      if (formData.date_of_birth) dataToSend.date_of_birth = formData.date_of_birth;
      if (formData.country?.trim()) dataToSend.country = formData.country;
      if (formData.city?.trim()) dataToSend.city = formData.city;
      if (formData.student_id?.trim()) dataToSend.student_id = formData.student_id;
      if (formData.department?.trim()) dataToSend.department = formData.department;
      if (formData.level?.trim()) dataToSend.level = formData.level;
      if (formData.bio?.trim()) dataToSend.bio = formData.bio;
      if (formData.emergency_contact_name?.trim()) dataToSend.emergency_contact_name = formData.emergency_contact_name;
      if (formData.emergency_contact_phone?.trim()) dataToSend.emergency_contact_phone = formData.emergency_contact_phone;

      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Compte créé avec succès ! Redirection vers la page de connexion...');
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
            className="text-center text-white px-12"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h1 className="text-4xl font-light mb-4">Rejoignez-nous</h1>
            <div className="w-20 h-0.5 bg-white mx-auto mb-4"></div>
            <p className="text-lg font-light opacity-90">
              Créez votre compte et accédez à nos ressources
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Register Form */}
      <motion.div 
        className="w-full lg:w-1/2 flex items-center justify-center bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-md w-full px-8">
          {/* Close Button */}
          <div className="flex justify-end mb-8">
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
            <h2 className="text-3xl font-light text-black mb-2">Inscription</h2>
            <div className="w-12 h-0.5 bg-black mx-auto mb-4"></div>
            
            {/* Progress Steps */}
            <div className="flex justify-center items-center space-x-4 mb-6">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep === step 
                        ? 'bg-black text-white' 
                        : currentStep > step 
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {currentStep > step ? '✓' : step}
                  </div>
                  {step < 3 && (
                    <div 
                      className={`w-8 h-0.5 ${
                        currentStep > step ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            
            <p className="text-sm text-gray-600">
              {currentStep === 1 && "Informations de connexion"}
              {currentStep === 2 && "Informations personnelles (optionnel)"}
              {currentStep === 3 && "Informations académiques (optionnel)"}
            </p>
          </motion.div>

          {/* Success Message */}
          {success && (
            <motion.div 
              className="mb-6 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {success}
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div 
              className="mb-6 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.div>
          )}

          {/* Register Form */}
          <motion.form 
            onSubmit={currentStep === 3 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}
            className="space-y-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {/* Étape 1 : Informations de base */}
            {currentStep === 1 && (
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {/* Name Field */}
                <div className="space-y-2">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="pl-10 h-12 border-gray-300 focus:border-black focus:ring-0 rounded-lg bg-gray-50 focus:bg-white transition-colors"
                      placeholder="Nom complet"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10 h-12 border-gray-300 focus:border-black focus:ring-0 rounded-lg bg-gray-50 focus:bg-white transition-colors"
                      placeholder="Adresse email"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Utilisez votre email @2ie.edu.com pour un accès étudiant, ou @admin.2ie.edu.com pour un accès administrateur
                  </p>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 pr-12 h-12 border-gray-300 focus:border-black focus:ring-0 rounded-lg bg-gray-50 focus:bg-white transition-colors"
                      placeholder="Mot de passe"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="pl-10 pr-12 h-12 border-gray-300 focus:border-black focus:ring-0 rounded-lg bg-gray-50 focus:bg-white transition-colors"
                      placeholder="Confirmer le mot de passe"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Étape 2 : Informations personnelles */}
            {currentStep === 2 && (
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-6">
                  <p className="text-sm text-gray-600">Ces informations sont optionnelles mais nous aident à personnaliser votre expérience</p>
                </div>

                {/* Phone */}
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="pl-10 h-12 border-gray-300 focus:border-black focus:ring-0 rounded-lg bg-gray-50 focus:bg-white transition-colors"
                    placeholder="Numéro de téléphone"
                  />
                </div>

                {/* Date of Birth */}
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    name="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                    className="pl-10 h-12 border-gray-300 focus:border-black focus:ring-0 rounded-lg bg-gray-50 focus:bg-white transition-colors"
                  />
                </div>

                {/* Country */}
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    name="country"
                    type="text"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="pl-10 h-12 border-gray-300 focus:border-black focus:ring-0 rounded-lg bg-gray-50 focus:bg-white transition-colors"
                    placeholder="Pays"
                  />
                </div>

                {/* City */}
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="pl-10 h-12 border-gray-300 focus:border-black focus:ring-0 rounded-lg bg-gray-50 focus:bg-white transition-colors"
                    placeholder="Ville"
                  />
                </div>

                {/* Address */}
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <Textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="pl-10 border-gray-300 focus:border-black focus:ring-0 rounded-lg bg-gray-50 focus:bg-white transition-colors resize-none"
                    placeholder="Adresse complète"
                    rows={3}
                  />
                </div>
              </motion.div>
            )}

            {/* Étape 3 : Informations académiques */}
            {currentStep === 3 && (
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-6">
                  <p className="text-sm text-gray-600">Informations académiques et contacts d'urgence (optionnel)</p>
                </div>

                {/* Student ID */}
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    name="student_id"
                    type="text"
                    value={formData.student_id}
                    onChange={handleInputChange}
                    className="pl-10 h-12 border-gray-300 focus:border-black focus:ring-0 rounded-lg bg-gray-50 focus:bg-white transition-colors"
                    placeholder="Numéro étudiant"
                  />
                </div>

                {/* Department */}
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    name="department"
                    type="text"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="pl-10 h-12 border-gray-300 focus:border-black focus:ring-0 rounded-lg bg-gray-50 focus:bg-white transition-colors"
                    placeholder="Département/Filière"
                  />
                </div>

                {/* Level */}
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    name="level"
                    type="text"
                    value={formData.level}
                    onChange={handleInputChange}
                    className="pl-10 h-12 border-gray-300 focus:border-black focus:ring-0 rounded-lg bg-gray-50 focus:bg-white transition-colors"
                    placeholder="Niveau (L1, L2, M1, etc.)"
                  />
                </div>

                {/* Emergency Contact Name */}
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    name="emergency_contact_name"
                    type="text"
                    value={formData.emergency_contact_name}
                    onChange={handleInputChange}
                    className="pl-10 h-12 border-gray-300 focus:border-black focus:ring-0 rounded-lg bg-gray-50 focus:bg-white transition-colors"
                    placeholder="Contact d'urgence (nom)"
                  />
                </div>

                {/* Emergency Contact Phone */}
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    name="emergency_contact_phone"
                    type="tel"
                    value={formData.emergency_contact_phone}
                    onChange={handleInputChange}
                    className="pl-10 h-12 border-gray-300 focus:border-black focus:ring-0 rounded-lg bg-gray-50 focus:bg-white transition-colors"
                    placeholder="Contact d'urgence (téléphone)"
                  />
                </div>

                {/* Bio */}
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <Textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="pl-10 border-gray-300 focus:border-black focus:ring-0 rounded-lg bg-gray-50 focus:bg-white transition-colors resize-none"
                    placeholder="Parlez-nous de vous (centres d'intérêt, domaines d'étude, etc.)"
                    rows={4}
                  />
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start text-sm pt-4 border-t">
                  <input
                    type="checkbox"
                    required
                    className="mr-2 mt-1 rounded border-gray-300 text-black focus:ring-0"
                  />
                  <span className="text-gray-600">
                    J'accepte les conditions d'utilisation et la politique de confidentialité
                  </span>
                </div>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-6">
              {currentStep > 1 && (
                <Button
                  type="button"
                  onClick={prevStep}
                  variant="outline"
                  className="flex-1 h-12 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  Précédent
                </Button>
              )}
              
              <Button
                type="submit"
                disabled={isLoading}
                className={`${currentStep === 1 ? 'w-full' : 'flex-1'} h-12 bg-black hover:bg-gray-800 text-white font-normal rounded-lg transition-all duration-200`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Création...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    {currentStep === 3 ? 'Créer mon compte' : 'Continuer'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                )}
              </Button>
            </div>
          </motion.form>

          {/* Login Link */}
          <motion.div 
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <p className="text-gray-600">
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