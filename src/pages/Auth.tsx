
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Apple, ArrowRight, Check, Loader2, Phone, X } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { Progress } from '@/components/ui/progress';

const Auth = () => {
  const { user, signIn, signUp, signInWithGoogle, signInWithApple, signInWithPhone, verifyOtp, isLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState<string>('');
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(tabParam === 'signup' ? 'signup' : 'signin');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isSubmittingPhone, setIsSubmittingPhone] = useState(false);

  useEffect(() => {
    if (activeTab === 'signup') {
      checkPasswordStrength(password);
    }
  }, [password, activeTab]);

  const checkPasswordStrength = (pass: string) => {
    const requirements = {
      length: pass.length >= 8,
      uppercase: /[A-Z]/.test(pass),
      lowercase: /[a-z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[^A-Za-z0-9]/.test(pass)
    };

    setPasswordRequirements(requirements);

    // Count how many requirements are met
    const strengthScore = Object.values(requirements).filter(Boolean).length;
    
    // Set strength percentage (0-100)
    setPasswordStrength(strengthScore * 20);

    // Provide feedback based on strength
    if (pass.length === 0) {
      setPasswordFeedback('');
    } else if (strengthScore <= 2) {
      setPasswordFeedback('Weak');
    } else if (strengthScore === 3) {
      setPasswordFeedback('Fair');
    } else if (strengthScore === 4) {
      setPasswordFeedback('Good');
    } else {
      setPasswordFeedback('Strong');
    }
  };

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    setError(null);

    // Validate password for signup
    if (activeTab === 'signup') {
      if (passwordStrength < 60) {
        setError('Please create a stronger password that meets at least 3 requirements');
        return;
      }
    }

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
                  minLength={8}
                />
                
                {password.length > 0 && (
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Password strength: </span>
                      <span className={`text-sm font-semibold ${
                        passwordStrength >= 80 ? 'text-green-600' : 
                        passwordStrength >= 60 ? 'text-blue-600' : 
                        passwordStrength >= 40 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {passwordFeedback}
                      </span>
                    </div>
                    
                    <Progress value={passwordStrength} className="h-2" />
                    
                    <div className="grid grid-cols-1 gap-1 mt-2">
                      <div className="flex items-center text-sm">
                        {passwordRequirements.length ? (
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                        ) : (
                          <X className="h-4 w-4 text-red-500 mr-2" />
                        )}
                        <span>At least 8 characters</span>
                      </div>
                      <div className="flex items-center text-sm">
                        {passwordRequirements.uppercase ? (
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                        ) : (
                          <X className="h-4 w-4 text-red-500 mr-2" />
                        )}
                        <span>At least one uppercase letter (A-Z)</span>
                      </div>
                      <div className="flex items-center text-sm">
                        {passwordRequirements.lowercase ? (
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                        ) : (
                          <X className="h-4 w-4 text-red-500 mr-2" />
                        )}
                        <span>At least one lowercase letter (a-z)</span>
                      </div>
                      <div className="flex items-center text-sm">
                        {passwordRequirements.number ? (
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                        ) : (
                          <X className="h-4 w-4 text-red-500 mr-2" />
                        )}
                        <span>At least one number (0-9)</span>
                      </div>
                      <div className="flex items-center text-sm">
                        {passwordRequirements.special ? (
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                        ) : (
                          <X className="h-4 w-4 text-red-500 mr-2" />
                        )}
                        <span>At least one special character (!@#$%^&*)</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-sportyfi-orange hover:bg-red-600 text-white"
                isLoading={isLoading}
                loadingText="Creating account..."
                disabled={passwordStrength < 60 && password.length > 0}
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
