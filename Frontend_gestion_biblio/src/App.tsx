
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Inscription from "./pages/Incrisption";
import Catalogue from "./pages/Catalogue";
import BookDetails from "./pages/BookDetails";
import MesEmprunts from "./pages/MesEmprunts";
import ProfilNew from "./pages/ProfilNew";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBooks from "./pages/AdminBooks";
import AdminRoute from "./components/AdminRoute";
import NotFound from "./pages/NotFound";
import FireCatProject from "./pages/FireCatProject";
import SportRetailProject from "./pages/SportRetailProject";
import WorkwearProject from "./pages/WorkwearProject";
import HockeyProject from "./pages/HockeyProject";
import PetProject from "./pages/PetProject";
import TechDetails from "./pages/TechDetails";
import DevelopmentProcess from "./pages/DevelopmentProcess";
import About from "./pages/About";
import Services from "./pages/Services";
import Events from "./pages/Events";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Blog from "./pages/Blog";
import BlogPostDetail from "./pages/BlogPostDetail";

const App = () => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/inscription" element={<Inscription />} />
            <Route path="/catalogue" element={<Catalogue />} />
            <Route path="/livre/:id" element={<BookDetails />} />
            <Route path="/mes-emprunts" element={<MesEmprunts />} />
            <Route path="/profil" element={<ProfilNew />} />
            
            {/* Routes Admin protégées */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            <Route path="/admin/books" element={
              <AdminRoute>
                <AdminBooks />
              </AdminRoute>
            } />
            
            <Route path="/projects/firecat" element={<FireCatProject />} />
            <Route path="/projects/sport-retail" element={<SportRetailProject />} />
            <Route path="/projects/workwear" element={<WorkwearProject />} />
            <Route path="/projects/hockey" element={<HockeyProject />} />
            <Route path="/projects/pet-tracker" element={<PetProject />} />
            <Route path="/tech-details" element={<TechDetails />} />
            <Route path="/development-process" element={<DevelopmentProcess />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/events" element={<Events />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPostDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
