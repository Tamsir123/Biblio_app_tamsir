
import { ArrowRight, Linkedin, MapPin, Phone, Mail, Book, Clock, Users, Globe, Facebook, Youtube, Twitter, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import emailjs from 'emailjs-com';

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer votre adresse email.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // EmailJS configuration
      const EMAILJS_SERVICE_ID = "service_i3h66xg";
      const EMAILJS_TEMPLATE_ID = "template_fgq53nh";
      const EMAILJS_PUBLIC_KEY = "wQmcZvoOqTAhGnRZ3";
      
      const templateParams = {
        from_name: "Abonné Bibliothèque",
        from_email: email,
        message: `Nouvelle demande d'abonnement à la newsletter d'E-Library 2iE.`,
        to_name: 'Équipe E-Library 2iE',
        reply_to: email
      };
      
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );
      
      toast({
        title: "Succès !",
        description: "Merci de vous être abonné à notre newsletter.",
        variant: "default"
      });
      
      setEmail("");
    } catch (error) {
      console.error("Error sending subscription:", error);
      
      toast({
        title: "Erreur",
        description: "Un problème est survenu. Veuillez réessayer plus tard.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer id="contact" className="bg-black text-white pt-16 pb-8 w-full relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '30px 30px'
        }}></div>
      </div>
      
      <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pb-10 ">
          {/* Informations principales */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-white p-2 mr-4 shadow-lg">
                <img 
                  src="https://www.2ie-edu.org/wp-content/uploads/2023/06/2iE-LOGO-1.png"
                  alt="Logo 2iE"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">E-Library 2iE</h3>
                <p className="text-blue-400 text-sm">Bibliothèque Électronique</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Centre de documentation et d'information de référence pour l'ingénierie en Afrique de l'Ouest. 
              Nous accompagnons les étudiants, chercheurs et professionnels dans leur quête de connaissances et d'innovation.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-gray-300">
                <MapPin className="w-4 h-4 mr-3 text-blue-400" />
                <span>Rue de la Science, Ouagadougou, Burkina Faso</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Phone className="w-4 h-4 mr-3 text-blue-400" />
                <span>+226 25 49 27 00</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Mail className="w-4 h-4 mr-3 text-blue-400" />
                <span>bibliotheque@2ie-edu.org</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white flex items-center">
              <Book className="w-5 h-5 mr-2 text-blue-400" />
              Services
            </h3>
            <ul className="space-y-3">
              <li><Link to="/catalogue" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center"><ArrowRight className="w-3 h-3 mr-2" />Catalogue en ligne</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center"><ArrowRight className="w-3 h-3 mr-2" />À propos</Link></li>
              <li><Link to="/mes-emprunts" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center"><ArrowRight className="w-3 h-3 mr-2" />Mes emprunts</Link></li>
              <li><Link to="/profil" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center"><ArrowRight className="w-3 h-3 mr-2" />Mon profil</Link></li>
            </ul>
            
            {/* Informations Clés */}
            <div className="mt-6 p-4 bg-blue-900/20 rounded-lg border border-blue-800/30">
              <h4 className="text-sm font-semibold text-blue-400 mb-3">Chiffres Clés</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex justify-between">
                  <span>Collection numérique</span>
                  <span className="text-blue-400 font-semibold">15,000+</span>
                </div>
                <div className="flex justify-between">
                  <span>Étudiants inscrits</span>
                  <span className="text-green-400 font-semibold">2,800+</span>
                </div>
                <div className="flex justify-between">
                  <span>Années d'expertise</span>
                  <span className="text-purple-400 font-semibold">25+</span>
                </div>
                <div className="flex justify-between">
                  <span>Places de lecture</span>
                  <span className="text-yellow-400 font-semibold">400</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white flex items-center">
              <Mail className="w-5 h-5 mr-2 text-blue-400" />
              Newsletter
            </h3>
            <p className="text-gray-300 mb-4 text-sm">
              Restez informé des nouveautés, événements et ressources d'E-Library 2iE.
            </p>
            <form className="space-y-4" onSubmit={handleSubscribe}>
              <div>
                <input 
                  type="email" 
                  placeholder="Votre adresse email" 
                  className="w-full px-4 py-3 bg-gray-800/70 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <button 
                type="submit" 
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Abonnement..." : (
                  <>
                    S'abonner
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </button>
            </form>
            
            {/* Horaires */}
            <div className="mt-6 p-4 bg-blue-900/20 rounded-lg border border-blue-800/30">
              <h4 className="text-sm font-semibold text-blue-400 mb-3 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Horaires d'ouverture
              </h4>
              <div className="space-y-1 text-sm text-gray-300">
                <div className="flex justify-between">
                  <span>Lun - Ven</span>
                  <span className="text-blue-400">7h30 - 18h30</span>
                </div>
                <div className="flex justify-between">
                  <span>Samedi</span>
                  <span className="text-blue-400">8h00 - 17h00</span>
                </div>
                <div className="flex justify-between">
                  <span>Dimanche</span>
                  <span className="text-red-400">Fermé</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Réseaux Sociaux - Section horizontale en bas */}
        <div className="py-8 ">
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-white flex items-center justify-center mb-2">
              <Globe className="w-6 h-6 mr-3 text-blue-400" />
              Suivez-nous sur les réseaux sociaux
            </h3>
            <p className="text-gray-400 text-sm">Restez connectés avec la communauté E-Library 2iE</p>
          </div>
          
          <div className="flex justify-center items-center gap-6">
            <a 
              href="https://www.linkedin.com/school/2ie-edu/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-white transition-all hover:scale-110 shadow-lg hover:shadow-blue-500/25 group"
              title="LinkedIn"
            >
              <Linkedin size={24} className="group-hover:scale-110 transition-transform" />
            </a>
            
            <a 
              href="https://www.facebook.com/2iEcampus" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-14 h-14 rounded-full bg-blue-800 hover:bg-blue-900 flex items-center justify-center text-white transition-all hover:scale-110 shadow-lg hover:shadow-blue-800/25 group"
              title="Facebook"
            >
              <Facebook size={24} className="group-hover:scale-110 transition-transform" />
            </a>
            
            <a 
              href="https://www.youtube.com/@2iEcampus" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white transition-all hover:scale-110 shadow-lg hover:shadow-red-500/25 group"
              title="YouTube"
            >
              <Youtube size={24} className="group-hover:scale-110 transition-transform" />
            </a>
            
            <a 
              href="https://twitter.com/2iEcampus" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-14 h-14 rounded-full bg-sky-500 hover:bg-sky-600 flex items-center justify-center text-white transition-all hover:scale-110 shadow-lg hover:shadow-sky-500/25 group"
              title="Twitter"
            >
              <Twitter size={24} className="group-hover:scale-110 transition-transform" />
            </a>
            
            <a 
              href="https://www.instagram.com/2ie_campus" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 flex items-center justify-center text-white transition-all hover:scale-110 shadow-lg hover:shadow-purple-500/25 group"
              title="Instagram"
            >
              <Instagram size={24} className="group-hover:scale-110 transition-transform" />
            </a>
            
            <a 
              href="https://www.2ie-edu.org" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 flex items-center justify-center text-white transition-all hover:scale-110 shadow-lg hover:shadow-green-500/25 group"
              title="Site Web Officiel"
            >
              <Globe size={24} className="group-hover:scale-110 transition-transform" />
            </a>
          </div>
        </div>
        
        {/* <div className="pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0 flex items-center">
            <span>© {new Date().getFullYear()} E-Library 2iE. Tous droits réservés.</span>
            <span className="mx-2 text-gray-600">|</span>
            <span className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              Institut International d'Ingénierie
            </span>
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy-policy" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">Politique de confidentialité</Link>
            <Link to="/terms" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">Conditions d'utilisation</Link>
          </div>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;
