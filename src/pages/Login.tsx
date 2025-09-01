import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import studyHero from '@/assets/study-hero.jpg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMagicLinkSent, setIsMagicLinkSent] = useState(false);
  const { signInWithMagicLink } = useAuth();

  const handleMagicLinkSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      await signInWithMagicLink(email);
      setIsMagicLinkSent(true);
    } catch (error) {
      console.error('Magic link error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isMagicLinkSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Mail className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Check your email</CardTitle>
            <CardDescription>
              We've sent a magic link to <strong>{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Click the link in your email to sign in. The link will expire in 1 hour.
            </p>
            <Button
              variant="outline"
              onClick={() => setIsMagicLinkSent(false)}
              className="w-full"
            >
              Try a different email
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left side - Hero image and welcome text */}
        <div className="hidden md:block space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Welcome to StudyBuddy
            </h1>
            <p className="text-xl text-muted-foreground">
              Transform your learning with interactive mini-games. Make studying fun and effective!
            </p>
          </div>
          <div className="relative">
            <img 
              src={studyHero} 
              alt="Study materials and learning" 
              className="rounded-2xl shadow-xl w-full h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Why StudyBuddy?</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• 14 different mini-games to keep learning engaging</li>
              <li>• Track your progress and improve retention</li>
              <li>• Create and manage your own study materials</li>
              <li>• Learn at your own pace with adaptive difficulty</li>
            </ul>
          </div>
        </div>

        {/* Right side - Login form */}
        <Card className="w-full max-w-md mx-auto">
                      <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl">Sign in to StudyBuddy</CardTitle>
              <CardDescription>
                Enter your email to receive a magic link
              </CardDescription>
            </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleMagicLinkSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading || !email}
                className="w-full h-12"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4 mr-2" />
                )}
                Send magic link
              </Button>
            </form>

            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                By signing in, you agree to our{' '}
                <a href="#" className="underline hover:text-primary">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="underline hover:text-primary">
                  Privacy Policy
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
