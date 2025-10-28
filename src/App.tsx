import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import { SkipToContent } from "@/components/SkipToContent";
import { Navbar } from "./components/Navbar";
import { ScrollToTop } from './components/ScrollToTop';
import { Footer } from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import Resources from "./pages/Resources";
import Forum from "./pages/Forum";
import Assessments from "./pages/Assessments";
import Analytics from "./pages/Analytics";
import Help from "./pages/Help";
import Login from "./pages/Login";
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import About from './pages/About';
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const showFooter = location.pathname !== '/login';
  // This wrapper component handles conditional rendering of the footer.

  return (
    <AuthProvider>
      <DataProvider>
        <TooltipProvider>
          <SkipToContent />
          <ScrollToTop />
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/about" element={<About />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/forum" element={<Forum />} />
                <Route path="/assessments" element={<Assessments />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/help" element={<Help />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/:username" element={<Profile />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            {showFooter && <Footer />}
          </div>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </DataProvider>
    </AuthProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter basename="/FlipSpace-elearning"><AppContent /></BrowserRouter>
  </QueryClientProvider>
);

export default App;
