import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Menu, X, ChevronDown, Search, User, ShoppingCart, Book, Users, MapPin, Phone, LogIn, Shield, LogOut, Settings, UserCircle, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from 'react-router-dom';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  profile_image?: string;
}

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Vérifier l'état de connexion
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsLoggedIn(true);
        } catch (error) {
          console.error('Erreur parsing user data:', error);
          setIsLoggedIn(false);
          setUser(null);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkAuthStatus();
    
    // Écouter les changements de localStorage
    window.addEventListener('storage', checkAuthStatus);
    return () => window.removeEventListener('storage', checkAuthStatus);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    navigate('/');
    setIsMenuOpen(false);
  };

  const getAvatarUrl = (user: UserData | null) => {
    if (user?.profile_image) {
      return user.profile_image.startsWith('/') 
        ? `http://localhost:5000${user.profile_image}`
        : user.profile_image;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&size=40&background=000000&color=ffffff&bold=true`;
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirection vers la page de recherche avec le terme
      console.log('Recherche:', searchQuery);
      // TODO: Implémenter la redirection vers /catalogue?search=${searchQuery}
    }
  };

  return (
    <motion.nav className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full", isScrolled ? "bg-white shadow-lg border-b border-gray-200" : "bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm")} initial={{
      opacity: 1,
      y: 0
    }} animate={{
      opacity: 1,
      y: 0
    }}>
      <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-3">
              <div className={cn("flex items-center justify-center w-12 h-12 rounded-lg transition-all", isScrolled ? "bg-white shadow-md" : "bg-white/90 backdrop-blur-sm")}>
                <img 
                  src="https://www.2ie-edu.org/wp-content/uploads/2023/06/2iE-LOGO-1.png" 
                  alt="E-Library 2iE Logo" 
                  className="w-8 h-8 rounded-md object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className={cn("font-bold text-lg leading-tight", isScrolled ? "text-gray-800" : "text-white")}>
                  E-Library 2iE
                </span>
                <span className={cn("text-xs leading-tight", isScrolled ? "text-gray-600" : "text-gray-300")}>
                  Bibliothèque Électronique
                </span>
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavigationMenu className={cn(isScrolled ? "" : "text-white")}>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink 
                    onClick={() => navigate('/')}
                    className={cn(navigationMenuTriggerStyle(), isScrolled ? "text-gray-700 hover:text-black hover:bg-gray-100" : "text-gray-100 hover:text-white bg-transparent hover:bg-white/10", "cursor-pointer")}
                  >
                    Accueil
                  </NavigationMenuLink>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuLink 
                    onClick={() => navigate('/catalogue')}
                    className={cn(navigationMenuTriggerStyle(), isScrolled ? "text-gray-700 hover:text-black hover:bg-gray-100" : "text-gray-100 hover:text-white bg-transparent hover:bg-white/10", "cursor-pointer")}
                  >
                    Catalogue
                  </NavigationMenuLink>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuLink 
                    onClick={() => navigate('/services')}
                    className={cn(navigationMenuTriggerStyle(), isScrolled ? "text-gray-700 hover:text-black hover:bg-gray-100" : "text-gray-100 hover:text-white bg-transparent hover:bg-white/10", "cursor-pointer")}
                  >
                    Services
                  </NavigationMenuLink>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuLink 
                    onClick={() => navigate('/events')}
                    className={cn(navigationMenuTriggerStyle(), isScrolled ? "text-gray-700 hover:text-black hover:bg-gray-100" : "text-gray-100 hover:text-white bg-transparent hover:bg-white/10", "cursor-pointer")}
                  >
                    Événements
                  </NavigationMenuLink>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuLink 
                    onClick={() => navigate('/about')}
                    className={cn(navigationMenuTriggerStyle(), isScrolled ? "text-gray-700 hover:text-black hover:bg-gray-100" : "text-gray-100 hover:text-white bg-transparent hover:bg-white/10", "cursor-pointer")}
                  >
                    À Propos
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            
            {/* Actions utilisateur */}
            <div className="flex items-center space-x-2 ml-4">
              {isLoggedIn ? (
                <>
                  {/* Menu utilisateur */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={cn("flex items-center space-x-2 px-2", isScrolled ? "text-gray-700 hover:text-black hover:bg-gray-100" : "text-gray-100 hover:text-white hover:bg-white/10")}
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={getAvatarUrl(user)} alt={user?.name} />
                          <AvatarFallback className="bg-black text-white text-xs">
                            {user?.name?.charAt(0)?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="hidden sm:flex flex-col items-start">
                          <span className="text-sm font-medium leading-none">{user?.name}</span>
                          <span className="text-xs opacity-70">{user?.role === 'admin' ? 'Administrateur' : 'Étudiant'}</span>
                        </div>
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user?.name}</p>
                          <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/profil')} className="cursor-pointer">
                        <UserCircle className="mr-2 h-4 w-4" />
                        <span>Mon Profil</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/mes-emprunts')} className="cursor-pointer">
                        <Book className="mr-2 h-4 w-4" />
                        <span>Mes Emprunts</span>
                      </DropdownMenuItem>
                      {user?.role === 'admin' && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => navigate('/admin')} className="cursor-pointer">
                            <Shield className="mr-2 h-4 w-4" />
                            <span>Administration</span>
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Déconnexion</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => navigate('/login')}
                    className={cn(isScrolled ? "text-gray-700 hover:text-black hover:bg-gray-100" : "text-gray-100 hover:text-white hover:bg-white/10")}
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Connexion
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => navigate('/inscription')}
                    className={cn(isScrolled ? "bg-black hover:bg-gray-800 text-white" : "bg-white text-black hover:bg-gray-100")}
                  >
                    Inscription
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className={cn("focus:outline-none", isScrolled ? "text-gray-700" : "text-white")}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={cn("md:hidden transition-all duration-300 overflow-hidden w-full", isMenuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0")}>
        <div className={cn("px-4 pt-4 pb-6 space-y-3", isScrolled ? "bg-white border-t" : "bg-black/95 backdrop-blur-sm")}>
          
          {/* Barre de recherche mobile */}
          <div className="mb-4">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn("w-full pl-10 pr-12 py-3 rounded-lg", 
                  isScrolled 
                    ? "bg-gray-50 border-gray-200 focus:border-gray-500" 
                    : "bg-white/90 border-white/50 focus:border-white text-gray-800"
                )}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Button 
                type="submit" 
                size="sm" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black hover:bg-gray-800 text-white px-3"
              >
                <Search className="w-3 h-3" />
              </Button>
            </form>
          </div>

          {/* Navigation Links */}
          <button 
            onClick={() => {
              navigate('/');
              setIsMenuOpen(false);
              window.scrollTo(0, 0);
            }}
            className={cn("flex w-full items-center px-3 py-3 rounded-lg font-medium", isScrolled ? "text-gray-700 hover:bg-gray-100 hover:text-black" : "text-gray-200 hover:bg-white/10 hover:text-white")}
          >
            <Book className="w-4 h-4 mr-3" />
            Accueil
          </button>
          
          {/* Catalogue */}
          <button 
            onClick={() => {
              navigate('/catalogue');
              setIsMenuOpen(false);
              window.scrollTo(0, 0);
            }}
            className={cn("flex w-full items-center px-3 py-3 rounded-lg font-medium", isScrolled ? "text-gray-700 hover:bg-gray-100 hover:text-black" : "text-gray-200 hover:bg-white/10 hover:text-white")}
          >
            <Search className="w-4 h-4 mr-3" />
            Catalogue
          </button>
          
          {/* Services */}
          <button 
            onClick={() => {
              navigate('/services');
              setIsMenuOpen(false);
              window.scrollTo(0, 0);
            }}
            className={cn("flex w-full items-center px-3 py-3 rounded-lg font-medium", isScrolled ? "text-gray-700 hover:bg-gray-100 hover:text-black" : "text-gray-200 hover:bg-white/10 hover:text-white")}
          >
            <Users className="w-4 h-4 mr-3" />
            Services
          </button>
          
          {/* Événements */}
          <button 
            onClick={() => {
              navigate('/events');
              setIsMenuOpen(false);
              window.scrollTo(0, 0);
            }}
            className={cn("flex w-full items-center px-3 py-3 rounded-lg font-medium", isScrolled ? "text-gray-700 hover:bg-gray-100 hover:text-black" : "text-gray-200 hover:bg-white/10 hover:text-white")}
          >
            <Calendar className="w-4 h-4 mr-3" />
            Événements
          </button>
          
          <button 
            onClick={() => {
              navigate('/about');
              setIsMenuOpen(false);
              window.scrollTo(0, 0);
            }}
            className={cn("flex w-full items-center px-3 py-3 rounded-lg font-medium", isScrolled ? "text-gray-700 hover:bg-gray-100 hover:text-black" : "text-gray-200 hover:bg-white/10 hover:text-white")}
          >
            <MapPin className="w-4 h-4 mr-3" />
            À Propos
          </button>
          
          {/* Divider */}
          <hr className={cn("my-4", isScrolled ? "border-gray-200" : "border-white/20")} />
          
          {/* User Actions */}
          <div className="space-y-2">
            {isLoggedIn ? (
              <>
                {/* Profil utilisateur mobile */}
                <div className={cn("flex items-center space-x-3 px-3 py-3 rounded-lg", isScrolled ? "bg-gray-50" : "bg-white/10")}>
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={getAvatarUrl(user)} alt={user?.name} />
                    <AvatarFallback className="bg-black text-white">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className={cn("text-sm font-medium", isScrolled ? "text-gray-900" : "text-white")}>
                      {user?.name}
                    </span>
                    <span className={cn("text-xs", isScrolled ? "text-gray-600" : "text-gray-300")}>
                      {user?.role === 'admin' ? 'Administrateur' : 'Étudiant'}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    navigate('/profil');
                    setIsMenuOpen(false);
                  }}
                  className={cn("flex w-full items-center px-3 py-3 rounded-lg font-medium", isScrolled ? "text-gray-700 hover:bg-gray-100 hover:text-black" : "text-gray-200 hover:bg-white/10 hover:text-white")}
                >
                  <UserCircle className="w-4 h-4 mr-3" />
                  Mon Profil
                </button>

                <button 
                  onClick={() => {
                    navigate('/mes-emprunts');
                    setIsMenuOpen(false);
                  }}
                  className={cn("flex w-full items-center px-3 py-3 rounded-lg font-medium", isScrolled ? "text-gray-700 hover:bg-gray-100 hover:text-black" : "text-gray-200 hover:bg-white/10 hover:text-white")}
                >
                  <Book className="w-4 h-4 mr-3" />
                  Mes Emprunts
                </button>

                {user?.role === 'admin' && (
                  <button 
                    onClick={() => {
                      navigate('/admin');
                      setIsMenuOpen(false);
                    }}
                    className={cn("flex w-full items-center px-3 py-3 rounded-lg font-medium", isScrolled ? "text-gray-700 hover:bg-gray-100 hover:text-black" : "text-gray-200 hover:bg-white/10 hover:text-white")}
                  >
                    <Shield className="w-4 h-4 mr-3" />
                    Administration
                  </button>
                )}
                
                <Button 
                  onClick={handleLogout}
                  variant="destructive"
                  className="w-full justify-start"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Button 
                  onClick={() => {
                    navigate('/login');
                    setIsMenuOpen(false);
                  }}
                  className={cn("w-full justify-start", isScrolled ? "bg-black hover:bg-gray-800 text-white" : "bg-white text-black hover:bg-gray-100")}
                >
                  <LogIn className="w-4 h-4 mr-3" />
                  Connexion
                </Button>
                
                <Button 
                  onClick={() => {
                    navigate('/inscription');
                    setIsMenuOpen(false);
                  }}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <User className="w-4 h-4 mr-3" />
                  Inscription
                </Button>
              </>
            )}
          </div>
          
          {/* Contact Info */}
          <div className={cn("mt-6 pt-4 border-t", isScrolled ? "border-gray-200" : "border-white/20")}>
            <button 
              onClick={() => scrollToSection('contact')} 
              className={cn("flex w-full items-center px-3 py-3 rounded-lg font-medium", isScrolled ? "text-gray-700 hover:bg-gray-100 hover:text-black" : "text-gray-200 hover:bg-white/10 hover:text-white")}
            >
              <Phone className="w-4 h-4 mr-3" />
              Contact
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
