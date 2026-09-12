import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Shield, AlertCircle } from 'lucide-react';
import { supabase } from '@/utils/supabase';
import { toast } from 'sonner';

interface AdminLoginProps {
  onSuccess: () => void;
  onBack: () => void;
}

export function AdminLogin({ onSuccess, onBack }: AdminLoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  // Admin credentials (kept for reference/demo)
  const ADMIN_EMAIL = 'admin@qilly.co.za';
  const ADMIN_PASSWORD = 'QillyAdmin2026!';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔐 Admin Login: Authenticating with Supabase...');
      
      // Authenticate with Supabase
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (signInError) {
        console.error('❌ Sign in error:', signInError);
        
        // Provide helpful error messages
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials.');
        } else if (signInError.message.includes('Email not confirmed')) {
          setError('Please confirm your email address before logging in.');
        } else {
          setError(signInError.message);
        }
        setIsLoading(false);
        return;
      }

      // Check if user is authenticated
      if (!authData.user || !authData.session) {
        setError('Authentication failed. Please try again.');
        setIsLoading(false);
        return;
      }

      console.log('✅ Supabase authentication successful');
      console.log('👤 User ID:', authData.user.id);
      console.log('📧 Email:', authData.user.email);

      // Verify user has admin role in the users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role, email')
        .eq('id', authData.user.id)
        .maybeSingle(); // Use maybeSingle() instead of single() to avoid error on 0 rows

      if (userError) {
        console.error('❌ Error fetching user role:', userError);
        setError('Error verifying admin access. Please try again.');
        setIsLoading(false);
        return;
      }

      // If user doesn't exist in users table, create them as admin
      if (!userData) {
        console.log('⚠️ User not found in users table. Creating admin user...');
        
        // ✅ FIX: Use UPSERT to avoid duplicate key errors
        const { error: insertError } = await supabase
          .from('users')
          .upsert({
            id: authData.user.id,
            email: authData.user.email,
            role: 'admin',
            created_at: new Date().toISOString()
          }, {
            onConflict: 'id',
            ignoreDuplicates: false // For admin, we want to update if exists
          });

        if (insertError) {
          console.error('❌ Error creating admin user:', insertError);
          setError('User setup failed. Please contact support.');
          setIsLoading(false);
          return;
        }

        console.log('✅ Admin user created successfully');
        toast.success('Admin account set up successfully!');
      } else {
        // User exists, check if they have admin role
        if (userData.role !== 'admin') {
          console.error('❌ User is not an admin. Role:', userData.role);
          setError('Access denied. This account does not have admin privileges.');
          
          // Sign out the non-admin user
          await supabase.auth.signOut();
          setIsLoading(false);
          return;
        }

        console.log('✅ User has admin role');
      }

      // Set admin session flag for backward compatibility
      sessionStorage.setItem('admin_logged_in', 'true');
      sessionStorage.setItem('admin_user_id', authData.user.id);
      sessionStorage.setItem('admin_email', authData.user.email || '');

      toast.success('Welcome back, Admin!');
      
      // Small delay for better UX
      setTimeout(() => {
        onSuccess();
      }, 500);

    } catch (err: any) {
      console.error('❌ Login error:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const fillAdminCredentials = () => {
    setLoginData({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });
  };

  return (
    <div className="w-full max-w-md">
      <Card className="shadow-lg border-2 border-blue-100">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Shield className="w-7 h-7" />
            Admin Login
          </CardTitle>
          <CardDescription className="text-blue-100">
            Secure access for Qilly administrators
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-email">Admin Email</Label>
              <Input
                id="admin-email"
                type="email"
                placeholder="Enter admin email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
              />
            </div>
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <Button
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700" 
              disabled={isLoading}
            >
              {isLoading ? 'Authenticating...' : 'Sign In as Admin'}
            </Button>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or</span>
              </div>
            </div>
            <Button 
              type="button" 
              variant="secondary" 
              className="w-full" 
              onClick={onBack}
              disabled={isLoading}
            >
              Back to Main Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}