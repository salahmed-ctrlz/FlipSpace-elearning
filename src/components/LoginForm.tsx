import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Eye, EyeOff, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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
      <div className="absolute inset-0 bg-black/30" />

      {/* Main Content */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
        <Card className="paper-shadow bg-background/90">
          <CardHeader>
            <div className="text-center mb-4">
              <img src={logo} alt="FlipSpace" className="h-12 mx-auto mb-4" />
              <p className="text-muted-foreground">
                Modern flipped learning platform
              </p>
            </div>
            <CardTitle className="font-serif text-2xl">Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
                  <AlertTitle className="text-destructive">Login Failed</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Enter your username"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
                    <DialogTrigger asChild>
                      <button
                        type="button"
                        className="text-xs text-primary hover:underline"
                      >
                        Forgot password?
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="font-serif">Reset Password</DialogTitle>
                        <DialogDescription>
                          Enter your email address and we'll send you a link to reset your password.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleForgotPassword} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="reset-email">Email</Label>
                          <Input
                            id="reset-email"
                            type="email"
                            value={forgotPasswordEmail}
                            onChange={(e) => setForgotPasswordEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                          />
                        </div>
                        <Button type="submit" className="w-full">
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
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border/60">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">Demo credentials</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCredentials(!showCredentials)}
                  aria-label={showCredentials ? 'Hide credentials' : 'Show credentials'}
                >
                  {showCredentials ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <div
                className={cn(
                  'transition-all duration-300 ease-in-out overflow-hidden',
                  showCredentials ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'
                )}
              >
                <div className="space-y-2 text-xs p-3 bg-muted/50 rounded-md border border-border/60">
                  <p>Click username or password to copy.</p>
                  <div className="p-2 rounded-sm">
                    <span className="font-bold">Teacher:</span>
                    <div className="flex items-center justify-between mt-1 pl-2">
                      <span className="hover:bg-muted p-1 rounded-sm cursor-pointer" onClick={() => handleCopy('teacher1')}>Username: teacher1 <Copy className="h-3 w-3 inline ml-1 text-muted-foreground" /></span>
                      <span className="hover:bg-muted p-1 rounded-sm cursor-pointer" onClick={() => handleCopy('teachpass')}>Password: teachpass <Copy className="h-3 w-3 inline ml-1 text-muted-foreground" /></span>
                    </div>
                  </div>
                  <div className="p-2 rounded-sm">
                    <span className="font-bold">Student:</span>
                    <div className="flex items-center justify-between mt-1 pl-2">
                      <span className="hover:bg-muted p-1 rounded-sm cursor-pointer" onClick={() => handleCopy('student1')}>Username: student1 <Copy className="h-3 w-3 inline ml-1 text-muted-foreground" /></span>
                      <span className="hover:bg-muted p-1 rounded-sm cursor-pointer" onClick={() => handleCopy('studpass')}>Password: studpass <Copy className="h-3 w-3 inline ml-1 text-muted-foreground" /></span>
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
