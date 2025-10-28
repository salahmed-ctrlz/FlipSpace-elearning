import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(`404 Error: User attempted to access non-existent route: ${location.pathname}`);
  }, [location.pathname]);

  return (
    <main id="main-content" className="flex-1 flex items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md mx-auto p-8"
      >
        <AlertTriangle className="h-16 w-16 mx-auto mb-6 text-primary" />
        <h1 className="font-serif text-4xl md:text-5xl mb-4">404 - Page Not Found</h1>
        <p className="text-lg text-muted-foreground mb-8">Oops! The page you are looking for does not exist. It might have been moved or deleted.</p>
        <Button asChild><Link to="/">Return to Dashboard</Link></Button>
      </motion.div>
    </main>
  );
};

export default NotFound;
