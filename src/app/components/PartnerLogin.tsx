import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Handshake, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface PartnerLoginProps {
  onSuccess: () => void;
  onBack: () => void;
}

export function PartnerLogin({ onSuccess, onBack }: PartnerLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Demo credentials for presentation
    if (
      (email === 'partner@procore.com' || email === 'partner@buildsmart.co.za' || email === 'partner@demo.com') &&
      password === 'Demo1234!'
    ) {
      sessionStorage.setItem('partner_logged_in', 'true');
      sessionStorage.setItem('partner_email', email);
      sessionStorage.setItem('user_type', 'partner');
      toast.success('Welcome to Qilly Partner Portal!');
      onSuccess();
    } else {
      toast.error('Invalid credentials. Please contact partners@qilly.co.za for access.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-100 p-6">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-center">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-full">
              <Handshake className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-center text-3xl">Partner Login</CardTitle>
          <CardDescription className="text-center">
            Access your Qilly Partner Portal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="partner@yourcompany.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login to Partner Portal'}
            </Button>
          </form>

          <div className="space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Partner Program
            </Button>
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Not a partner yet?{' '}
              <button
                type="button"
                onClick={onBack}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Apply Now
              </button>
            </p>
            <p className="text-xs text-gray-500">
              Need help? Contact partners@qilly.co.za
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
