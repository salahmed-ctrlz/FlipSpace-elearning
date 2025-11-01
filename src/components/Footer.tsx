import logo from '@/assets/logo.svg';
import { Link } from 'react-router-dom';
import { DZ } from 'country-flag-icons/react/3x2';
import { useState } from 'react';
import { Mail, X, Send } from 'lucide-react';

// Contact Modal Component
const ContactModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    
    await new Promise(resolve => setTimeout(resolve, 1200));
    console.log('Contact form:', { email, message });
    
    setStatus('sent');
    setTimeout(() => {
      onClose();
      setEmail('');
      setMessage('');
      setStatus('idle');
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
    >
      <div 
        className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative px-6 py-5 border-b border-border/60 bg-gradient-to-br from-muted/50 to-muted/30">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-xl">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <h3 id="contact-modal-title" className="text-lg font-semibold text-foreground">
              Get in Touch
            </h3>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground hover:bg-background/80 rounded-lg transition-all"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <label htmlFor="contact-email" className="text-sm font-medium text-foreground">
              Email Address
            </label>
            <input
              id="contact-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full h-11 px-4 bg-background border border-border rounded-xl 
                         focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary 
                         transition-all text-sm placeholder:text-muted-foreground/50"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="contact-message" className="text-sm font-medium text-foreground">
              Message
            </label>
            <textarea
              id="contact-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={5}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl 
                         focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary 
                         transition-all text-sm resize-none placeholder:text-muted-foreground/50"
              placeholder="How can we help you?"
            />
          </div>

          <button
            type="submit"
            disabled={status !== 'idle'}
            className="w-full h-11 flex items-center justify-center gap-2 bg-primary text-primary-foreground 
                       rounded-xl font-medium hover:bg-primary/90 active:scale-[0.98] transition-all 
                       disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md text-sm"
          >
            {status === 'idle' && (
              <>
                <Send className="w-4 h-4" />
                Send Message
              </>
            )}
            {status === 'sending' && (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Sending...
              </>
            )}
            {status === 'sent' && (
              <>
                <span className="text-lg">✓</span>
                Sent Successfully!
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export const Footer = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer className="bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 border-t border-border/50">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Main Content */}
          <div className="py-12 sm:py-16 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-16">
              
              {/* University Section */}
              <div className="lg:col-span-7 space-y-5 sm:space-y-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <DZ 
                    title="Algeria" 
                    className="w-10 sm:w-12 h-auto mt-1 rounded shadow-md flex-shrink-0" 
                  />
                  <div className="space-y-2 sm:space-y-3 flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-foreground leading-tight">
                      Tahri Mohamed University of Bechar
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      Algerian Ministry of Higher Education and Scientific Research
                    </p>
                  </div>
                </div>
                
                <div className="pl-13 sm:pl-16 space-y-2 sm:space-y-2.5 text-xs text-muted-foreground/80">
                  <p className="leading-relaxed">
                    ⴰⵖⵍⵉⴼ ⵏ ⵓ ⵙⴻⵍⵎⴻⴷ ⵓⵏⵏⵉⴳ ⴷ ⵓⵏⴰⴷⵉ ⵓⵙⵙⵏⴰⵏ
                  </p>
                  <p className="leading-relaxed">Faculty of Arts and Languages</p>
                  <p className="leading-relaxed">Department of English</p>
                </div>
              </div>

              {/* Platform & Navigation */}
              <div className="lg:col-span-5 grid grid-cols-2 gap-8 sm:gap-10 lg:gap-12">
                
                {/* Platform */}
                <div className="space-y-4 sm:space-y-5">
                  <h4 className="text-xs sm:text-sm font-semibold text-foreground uppercase tracking-wide">
                    Platform
                  </h4>
                  <div className="space-y-3 sm:space-y-4">
                    <Link 
                      to="/" 
                      onClick={scrollToTop}
                      className="inline-block group"
                    >
                      <img 
                        src={logo} 
                        alt="FlipSpace" 
                        className="h-8 sm:h-10 transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-md" 
                      />
                    </Link>
                    <p className="text-xs text-muted-foreground/80 leading-relaxed max-w-[180px]">
                      Modern interactive learning environment for academic excellence.
                    </p>
                  </div>
                </div>

                {/* Navigation */}
                <div className="space-y-4 sm:space-y-5">
                  <h4 className="text-xs sm:text-sm font-semibold text-foreground uppercase tracking-wide">
                    Navigation
                  </h4>
                  <nav className="flex flex-col gap-2.5 sm:gap-3">
                    <Link 
                      to="/about" 
                      className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors 
                                 duration-200 w-fit relative group"
                    >
                      About
                      <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary transition-all 
                                     duration-200 group-hover:w-full" />
                    </Link>
                    <button
                      onClick={() => setIsContactOpen(true)}
                      className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors 
                                 duration-200 text-left w-fit relative group"
                    >
                      Contact
                      <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary transition-all 
                                     duration-200 group-hover:w-full" />
                    </button>
                    <Link 
                      to="/privacy" 
                      className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors 
                                 duration-200 w-fit relative group"
                    >
                      Privacy
                      <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary transition-all 
                                     duration-200 group-hover:w-full" />
                    </Link>
                    <Link 
                      to="/terms" 
                      className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors 
                                 duration-200 w-fit relative group"
                    >
                      Terms
                      <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary transition-all 
                                     duration-200 group-hover:w-full" />
                    </Link>
                  </nav>
                </div>

              </div>
            </div>
          </div>

          {/* Bottom Bar with Copyright & Developer Link */}
          <div className="border-t border-border/50 py-5 sm:py-6">
            <div className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-2 text-xs text-muted-foreground/70">
              <span>© {new Date().getFullYear()} FlipSpace. All rights reserved.</span>
              
              {/* Developer Link with Tooltip */}
              <div className="relative inline-block group">
                <a
                  href="https://salahmed-ctrlz.github.io/salaheddine-medkour-portfolio/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-1 underline-offset-2 hover:text-foreground transition-colors duration-200"
                  aria-label="Visit developer portfolio"
                >
                  Dev.
                </a>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 
                                invisible opacity-0 group-hover:visible group-hover:opacity-100 
                                transition-all duration-200 z-10">
                  <a
                    href="https://salahmed-ctrlz.github.io/salaheddine-medkour-portfolio/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium 
                               rounded-lg whitespace-nowrap shadow-lg hover:bg-primary/90 transition-colors"
                  >
                    Visit Developer!
                  </a>
                  {/* Arrow */}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rotate-45" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </>
  );
};