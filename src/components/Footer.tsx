import logo from '@/assets/logo.svg';
import { Link, useLocation } from 'react-router-dom';

export const Footer = () => {
  const location = useLocation();

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border/40">
      <div className="container max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between py-5 px-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-3 mb-3 sm:mb-0">
          <Link to="/" onClick={handleLogoClick} className="flex items-center gap-2 group">
            <img src={logo} alt="FlipSpace" className="h-6" />
          </Link>
          <span>&copy; {new Date().getFullYear()} FlipSpace. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-x-6 gap-y-2 flex-wrap justify-center">
          <Link to="/about" className="hover:text-primary transition-colors">
            About
          </Link>
          <a href="mailto:contact@flipspace.edu" className="hover:text-primary transition-colors">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};