import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BookOpen, Users, Clock, Database, GraduationCap, Monitor, Award, Target, Shield, ChartBar } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";

const AnimatedCounter = ({
  end,
  duration = 2000,
  prefix = "",
  suffix = "",
  decimals = 0
}: {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const inView = useInView(countRef, {
    once: true,
    margin: "-100px"
  });
  useEffect(() => {
    if (!inView) return;
    let startTime: number;
    let animationFrame: number;
    const startAnimation = (timestamp: number) => {
      startTime = timestamp;
      animate(timestamp);
    };
    const animate = (timestamp: number) => {
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentCount = progress * end;
      setCount(currentCount);
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    animationFrame = requestAnimationFrame(startAnimation);
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, inView]);
  return <span ref={countRef} className="font-bold tabular-nums">
      {prefix}{count.toFixed(decimals)}{suffix}
    </span>;
};

const WhyELibrary = () => {
  const isMobile = useIsMobile();
  
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
        duration: 0.8
      }
    }
  };
  
  const itemVariants = {
    hidden: {
      y: 20,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };
  
  return (
    <section id="why-elibrary" className="relative py-16 md:py-24 bg-white overflow-hidden">
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12 md:mb-16" 
          initial="hidden" 
          whileInView="visible" 
          viewport={{
            once: true,
            margin: "-100px"
          }} 
          variants={containerVariants}
        >
          <motion.h2 
            variants={itemVariants} 
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3"
          >
            Pourquoi l'E-Library 2iE ?
          </motion.h2>
          <motion.p 
            variants={itemVariants} 
            className="text-gray-600 text-lg max-w-3xl mx-auto"
          >
            Une bibliothèque moderne au service de l'excellence académique et de la recherche à 2iE
          </motion.p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16" 
          initial="hidden" 
          whileInView="visible" 
          viewport={{
            once: true,
            margin: "-100px"
          }} 
          variants={containerVariants}
        >
          <motion.div 
            variants={itemVariants} 
            className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-center hover:bg-gray-100 transition-all"
          >
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-gray-700" />
            </div>
            <h3 className="text-gray-900 text-2xl lg:text-3xl font-bold mb-3">
              <AnimatedCounter end={15000} suffix="+" />
            </h3>
            <p className="text-gray-700">
              Ouvrages et ressources documentaires disponibles pour enrichir vos connaissances
            </p>
          </motion.div>
          
          <motion.div 
            variants={itemVariants} 
            className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-center hover:bg-gray-100 transition-all"
          >
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-700" />
            </div>
            <h3 className="text-gray-900 text-2xl lg:text-3xl font-bold mb-3">
              <AnimatedCounter end={2500} suffix="+" />
            </h3>
            <p className="text-gray-700">
              Étudiants, enseignants et chercheurs utilisent quotidiennement nos services
            </p>
          </motion.div>
          
          <motion.div 
            variants={itemVariants} 
            className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-center hover:bg-gray-100 transition-all"
          >
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-700" />
            </div>
            <h3 className="text-gray-900 text-2xl lg:text-3xl font-bold mb-3">
              7j/7
            </h3>
            <p className="text-gray-700">
              Accès 24h/24 aux ressources numériques et services en ligne de la bibliothèque
            </p>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="mb-12" 
          initial="hidden" 
          whileInView="visible" 
          viewport={{
            once: true,
            margin: "-100px"
          }} 
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Nos Services d'Excellence
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Des ressources et services adaptés aux besoins de la communauté académique 2iE
            </p>
          </motion.div>
          
          <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              variants={itemVariants} 
              className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all"
            >
              <div className="flex items-start">
                <div className="bg-gray-200 rounded-full p-3 mr-4">
                  <Database className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Ressources Numériques</h4>
                  <p className="text-gray-700">Accès à des bases de données spécialisées, e-books et revues scientifiques internationales.</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              variants={itemVariants} 
              className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all"
            >
              <div className="flex items-start">
                <div className="bg-gray-200 rounded-full p-3 mr-4">
                  <GraduationCap className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Accompagnement Recherche</h4>
                  <p className="text-gray-700">Formation à la recherche documentaire et support méthodologique personnalisé.</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              variants={itemVariants} 
              className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all"
            >
              <div className="flex items-start">
                <div className="bg-gray-200 rounded-full p-3 mr-4">
                  <Monitor className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Espaces Collaboratifs</h4>
                  <p className="text-gray-700">Salles de travail équipées et espaces d'étude adaptés aux projets de groupe.</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              variants={itemVariants} 
              className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all"
            >
              <div className="flex items-start">
                <div className="bg-gray-200 rounded-full p-3 mr-4">
                  <Award className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Excellence Académique</h4>
                  <p className="text-gray-700">Support à la publication scientifique et valorisation des travaux de recherche.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="text-center mt-10">
            <Link 
              to="/services" 
              onClick={() => window.scrollTo(0, 0)}
              className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all group"
            >
              Découvrir tous nos services
              <BookOpen className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyELibrary;
