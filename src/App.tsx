import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieBanner } from "@/components/CookieBanner";
import Home from "@/pages/Home";
import Catalog from "@/pages/Catalog";
import CarDetail from "@/pages/CarDetail";
import Sell from "@/pages/Sell";
import Contact from "@/pages/Contact";
import ChiSiamo from "@/pages/ChiSiamo";
import CertificazioneDigitale from "@/pages/CertificazioneDigitale";
import Auth from "@/pages/Auth";
import { Privacy, CookiePolicy, Terms, LegalNotes } from "@/pages/Legal";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminCars from "@/pages/admin/AdminCars";
import AdminCarEdit from "@/pages/admin/AdminCarEdit";
import AdminCertiShield from "@/pages/admin/AdminCertiShield";
import AdminRequests from "@/pages/admin/AdminRequests";
import NotFound from "./pages/NotFound";
import ScrollToTop from "@/components/ScrollToTop";
import { motion } from "framer-motion";
import { LanguageProvider } from "@/lib/i18n";
import { HelmetProvider } from "react-helmet-async";

const queryClient = new QueryClient();

const PublicShell = () => {
  const location = useLocation();
  const overHero = ["/", "/chi-siamo", "/contatti"].includes(location.pathname);
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className={overHero ? "flex-1" : "flex-1 pt-16 md:pt-20"}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/catalogo" element={<Catalog />} />
              <Route path="/auto/:id" element={<CarDetail />} />
              <Route path="/vendi" element={<Sell />} />
              <Route path="/contatti" element={<Contact />} />
              <Route path="/chi-siamo" element={<ChiSiamo />} />
              <Route path="/certificazione-digitale" element={<CertificazioneDigitale />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/cookie" element={<CookiePolicy />} />
              <Route path="/termini" element={<Terms />} />
              <Route path="/note-legali" element={<LegalNotes />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <AuthProvider>
              <Routes>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="auto" element={<AdminCars />} />
                  <Route path="auto/:id" element={<AdminCarEdit />} />
                  <Route path="certishield" element={<AdminCertiShield />} />
                  <Route path="richieste" element={<AdminRequests />} />
                </Route>
                <Route path="*" element={<PublicShell />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
