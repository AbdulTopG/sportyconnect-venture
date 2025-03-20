
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Apple, ArrowRight, Check, Loader2, Phone } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

const Auth = () => {
  const { user, signIn, signUp, signInWithGoogle, signInWithApple, signInWithPhone, verifyOtp, isLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(tabParam === 'signup' ? 'signup' : 'signin');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isSubmittingPhone, setIsSubmittingPhone] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    setError(null);

    try {
      if (activeTab === 'signin') {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  const handlePhoneAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingPhone) return;
    
    setError(null);
    setIsSubmittingPhone(true);

    try {
      if (!showOtpInput) {
        await signInWithPhone(phone);
        setShowOtpInput(true);
      } else {
        await verifyOtp(phone, otp);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsSubmittingPhone(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (isLoading) return;
    
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error("Google sign in error in component:", err);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight">
            {activeTab === 'signin' ? 'Sign in to your account' : 'Create a new account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {activeTab === 'signin' 
              ? "Don't have an account? " 
              : "Already have an account? "}
            <Button 
              variant="link" 
              className="p-0 h-auto font-medium text-sportyfi-orange hover:text-red-600"
              onClick={() => setActiveTab(activeTab === 'signin' ? 'signup' : 'signin')}
            >
              {activeTab === 'signin' ? 'Sign up' : 'Sign in'}
            </Button>
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="mt-6">
            <form className="space-y-6" onSubmit={handleAuth}>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div>
                <Label htmlFor="signin-email">Email address</Label>
                <Input
                  id="signin-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                  placeholder="••••••••"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-sportyfi-orange hover:bg-red-600 text-white"
                isLoading={isLoading}
                loadingText="Signing in..."
              >
                Sign in
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  <FcGoogle className="mr-2 h-5 w-5" />
                  Google
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => signInWithApple()}
                  disabled={isLoading}
                >
                  <Apple className="mr-2 h-5 w-5" />
                  Apple
                </Button>
              </div>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or use phone
                  </span>
                </div>
              </div>

              <form className="mt-6 space-y-4" onSubmit={handlePhoneAuth}>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1"
                    placeholder="+1234567890"
                    disabled={showOtpInput && isLoading}
                  />
                  <p className="text-xs text-gray-500 mt-1">Include your country code (e.g., +1 for US)</p>
                </div>

                {showOtpInput && (
                  <div>
                    <Label htmlFor="otp">Verification Code</Label>
                    <Input
                      id="otp"
                      type="text"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="mt-1"
                      placeholder="123456"
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  variant="outline"
                  className="w-full flex items-center justify-center"
                  isLoading={isSubmittingPhone}
                  loadingText={showOtpInput ? "Verifying..." : "Sending code..."}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  {showOtpInput ? 'Verify code' : 'Continue with phone'}
                </Button>
              </form>
            </div>
          </TabsContent>

          <TabsContent value="signup" className="mt-6">
            <form className="space-y-6" onSubmit={handleAuth}>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div>
                <Label htmlFor="signup-email">Email address</Label>
                <Input
                  id="signup-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                  placeholder="••••••••"
                  minLength={6}
                />
                <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters</p>
              </div>

              <Button
                type="submit"
                className="w-full bg-sportyfi-orange hover:bg-red-600 text-white"
                isLoading={isLoading}
                loadingText="Creating account..."
              >
                Create account
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
