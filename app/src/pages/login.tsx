import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/authContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, AlertCircle, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const result = login(email, password);
    setIsLoading(false);

    if (result.success) {
      // Check if admin or user and redirect accordingly
      if (email === 'admin@example.com') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
<div className="min-h-screen flex items-center justify-center bg-background p-4">
<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />      
      <Card className="w-full max-w-md animate-fade-in glass">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <LogIn className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm animate-scale-in">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full glow-primary" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 rounded-lg bg-muted/50 text-sm">
            <p className="font-medium text-foreground mb-2">Demo Credentials:</p>
            <p className="text-muted-foreground">
              Admin: <span className="text-foreground font-mono">admin@example.com</span>
            </p>
            <p className="text-muted-foreground">
              User: <span className="text-foreground font-mono">john@example.com</span>
            </p>
            <p className="text-muted-foreground mt-1">
              Password: <span className="text-foreground font-mono">any 6+ chars</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
