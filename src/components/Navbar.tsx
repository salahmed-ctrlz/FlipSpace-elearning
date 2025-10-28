import { useState } from 'react';
import { Link, useNavigate, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { LogOut, BookOpen, MessageSquare, FileCheck, BarChart3, HelpCircle, Menu, User, Home } from 'lucide-react';
import logo from '@/assets/logo.svg';
import { cn } from '@/lib/utils';

export const Navbar = () => {
  const { user, isTeacher, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogoClick = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavLinkClick = (to: string) => {
    if (location.pathname === to) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/resources', icon: BookOpen, label: 'Resources' },
    { to: '/forum', icon: MessageSquare, label: 'Forum' },
    { to: '/assessments', icon: FileCheck, label: 'Assessments' },
    { to: '/messages', icon: MessageSquare, label: 'Messages' },
    ...(isTeacher ? [{ to: '/analytics', icon: BarChart3, label: 'Analytics' }] : []),
    { to: '/help', icon: HelpCircle, label: 'Help' },
  ];

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all",
      isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
    );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 max-w-[1200px] items-center justify-between">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-3 group" onClick={handleLogoClick}>
          <img src={logo} alt="FlipSpace" className="h-8" />
        </Link>

        {/* Center: Desktop Menu */}
        {user && (
          <div className="hidden md:flex items-center gap-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return item.label === 'Home' ? ( // Special case for Home to use "end" prop
                <NavLink key={item.to} to={item.to} className={navLinkClass} onClick={() => handleNavLinkClick(item.to)} end>
                  <Icon className="h-4 w-4" />
                  <span className="sr-only">Home</span>
                </NavLink>
              ) : (
                <NavLink key={item.to} to={item.to} className={navLinkClass} onClick={() => handleNavLinkClick(item.to)}>
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </div>
        )}

        {/* Right: User Actions */}
        {user && (
          <div className="flex items-center">
            {/* Desktop User Info */}
            <div className="hidden md:flex items-center gap-4">
              <Button variant="ghost" size="sm" className="gap-2 h-auto py-1 px-2" asChild>
                <Link to="/profile">
                  <User className="h-4 w-4" />
                  <div className="text-left">
                    <p className="text-sm font-medium">{user.name}</p>
                  </div>
                </Link>
              </Button>
              <div className="h-6 w-px bg-border" />
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2"
                aria-label="Log out"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="sm" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle className="font-serif text-left">Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-6">
                  <div className="pb-4 border-b border-border">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                  </div>
                  
                  <NavLink to="/profile" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>
                    <User className="h-4 w-4" />
                    Profile
                  </NavLink>
                  {menuItems.map((item) => {
                    const Icon = item.icon; // No special "end" prop needed for mobile nav
                    return (
                      <NavLink key={item.to} to={item.to} onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>
                          <Icon className="h-4 w-4" />
                          {item.label}
                      </NavLink>
                    );
                  })}
                  <Button
                    variant="outline"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="gap-2 mt-4"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                    </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        )}
      </nav>
    </header>
  );
};
