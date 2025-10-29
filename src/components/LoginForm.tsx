import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Eye, EyeOff, Copy, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DZ } from 'country-flag-icons/react/3x2';
import logo from '@/assets/logo.svg';
import backgroundImage from '@/assets/backgroundImage.png';
import { cn } from '@/lib/utils';

export const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCredentials, setShowCredentials] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      });
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Password Reset Sent',
      description: `A password reset link has been sent to ${forgotPasswordEmail}`,
    });
    setForgotPasswordEmail('');
    setForgotPasswordOpen(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard!',
      description: `${text} has been copied.`,
    });
  };

  return (
    <div className="relative min-h-full flex flex-col">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-sm"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-black/40" />

      {/* Main Content */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Card className="paper-shadow-lg bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 border-border/30">
            <CardHeader className="text-center space-y-6 pb-8">
              {/* University Header */}
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <DZ 
                    title="Algeria" 
                    className="w-8 h-auto rounded shadow-sm" 
                  />
                  <div className="text-left">
                    <p className="text-xs font-semibold text-foreground/90 leading-tight">
                      Tahri Mohamed University of Bechar
                    </p>
                    <p className="text-[10px] text-muted-foreground/70 leading-tight mt-0.5">
                      Faculty of Arts and Languages
                    </p>
                  </div>
                </div>
                <div className="space-y-1 text-[10px] text-muted-foreground/60 leading-relaxed">
                  <p className="font-medium">Algerian Ministry of Higher Education and Scientific Research</p>
                  <p className="opacity-80">ⴰⵖⵍⵉⴼ ⵏ ⵓ ⵙⴻⵍⵎⴻⴷ ⵓⵏⵏⵉⴳ ⴷ ⵓⵏⴰⴷⵉ ⵓⵙⵙⵏⴰⵏ</p>
                </div>
              </div>

              {/* Logo & Title */}
              <div className="pt-2 space-y-4">
                <img src={logo} alt="FlipSpace" className="h-16 mx-auto" />
                <div className="space-y-2">
                  <CardTitle className="font-serif text-3xl tracking-tight">
                    Welcome Back
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Enter your credentials to access your account
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 px-6 pb-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <Alert variant="destructive" className="bg-destructive/10 border-destructive/40">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle className="text-sm font-semibold">Login Failed</AlertTitle>
                    <AlertDescription className="text-xs">{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm font-medium">
                      Username
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      placeholder="Enter your username"
                      disabled={loading}
                      className="h-11 bg-background/50 border-border/60 focus:bg-background transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm font-medium">
                        Password
                      </Label>
                      <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
                        <DialogTrigger asChild>
                          <button
                            type="button"
                            className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                          >
                            Forgot password?
                          </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader className="space-y-3">
                            <div className="flex items-center gap-3">
                              <DZ title="Algeria" className="w-6 h-auto rounded shadow-sm" />
                              <DialogTitle className="font-serif text-xl">Reset Password</DialogTitle>
                            </div>
                            <DialogDescription className="text-sm">
                              Enter your email address and we'll send you a link to reset your password.
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleForgotPassword} className="space-y-5 pt-4">
                            <div className="space-y-2">
                              <Label htmlFor="reset-email" className="text-sm font-medium">
                                Email Address
                              </Label>
                              <Input
                                id="reset-email"
                                type="email"
                                value={forgotPasswordEmail}
                                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="h-11"
                              />
                            </div>
                            <Button type="submit" className="w-full h-11">
                              Send Reset Link
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter your password"
                      disabled={loading}
                      className="h-11 bg-background/50 border-border/60 focus:bg-background transition-colors"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-11 text-sm font-semibold shadow-sm" 
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>

              {/* Demo Credentials Section */}
              <div className="pt-6 space-y-4 border-t border-border/40">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">Demo Credentials</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCredentials(!showCredentials)}
                    aria-label={showCredentials ? 'Hide credentials' : 'Show credentials'}
                    className="h-8 px-2"
                  >
                    {showCredentials ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <div
                  className={cn(
                    'transition-all duration-300 ease-in-out overflow-hidden',
                    showCredentials ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  )}
                >
                  <div className="space-y-3 text-xs p-4 bg-muted/40 rounded-lg border border-border/40">
                    <p className="text-muted-foreground/80 text-center pb-2 border-b border-border/30">
                      Click to copy username or password
                    </p>

                    {/* Teacher Credentials */}
                    <div className="space-y-2 p-3 bg-background/50 rounded-md">
                      <p className="font-semibold text-foreground text-sm">
                        Teacher (Pr. Khalki Smaine)
                      </p>
                      <div className="space-y-1.5 pl-1">
                        <button
                          type="button"
                          onClick={() => handleCopy('teacher1')}
                          className="flex items-center justify-between w-full p-2 hover:bg-muted/60 
                                   rounded transition-colors group"
                        >
                          <span className="text-muted-foreground">
                            Username: <span className="font-mono text-foreground">teacher1</span>
                          </span>
                          <Copy className="h-3 w-3 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopy('teachpass')}
                          className="flex items-center justify-between w-full p-2 hover:bg-muted/60 
                                   rounded transition-colors group"
                        >
                          <span className="text-muted-foreground">
                            Password: <span className="font-mono text-foreground">teachpass</span>
                          </span>
                          <Copy className="h-3 w-3 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                        </button>
                      </div>
                    </div>

                    {/* Student Credentials */}
                    <div className="space-y-2 p-3 bg-background/50 rounded-md">
                      <p className="font-semibold text-foreground text-sm">
                        Student (Hamoudi Benarba)
                      </p>
                      <div className="space-y-1.5 pl-1">
                        <button
                          type="button"
                          onClick={() => handleCopy('student1')}
                          className="flex items-center justify-between w-full p-2 hover:bg-muted/60 
                                   rounded transition-colors group"
                        >
                          <span className="text-muted-foreground">
                            Username: <span className="font-mono text-foreground">student1</span>
                          </span>
                          <Copy className="h-3 w-3 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopy('studpass')}
                          className="flex items-center justify-between w-full p-2 hover:bg-muted/60 
                                   rounded transition-colors group"
                        >
                          <span className="text-muted-foreground">
                            Password: <span className="font-mono text-foreground">studpass</span>
                          </span>
                          <Copy className="h-3 w-3 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};