import { useState } from 'react';
import { ArrowLeft, KeyRound, Mail } from 'lucide-react';
import { supabase } from '@/utils/supabase';
import { getPasswordResetRedirectUrl, validatePassword } from '@/utils/password';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';

interface PasswordRecoveryProps {
  mode: 'request' | 'update';
  onBack: () => void;
  onComplete?: () => void;
}

export function PasswordRecovery({ mode, onBack, onComplete }: PasswordRecoveryProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const requestReset = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: getPasswordResetRedirectUrl(),
      });
      if (resetError) throw resetError;
      setMessage('If an account exists for that email, a secure password-reset link has been sent.');
    } catch (requestError) {
      console.error('Password reset request failed:', requestError);
      setError('We could not send the reset email. Please wait a moment and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    const validationError = validatePassword(password);
    if (validationError) {
      setError(validationError);
      return;
    }
    if (password !== confirmPassword) {
      setError('The passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setMessage('Your password has been changed successfully.');
      setPassword('');
      setConfirmPassword('');
      window.history.replaceState({}, document.title, window.location.pathname);
      window.setTimeout(() => onComplete?.(), 900);
    } catch (updateError) {
      console.error('Password update failed:', updateError);
      setError('The password could not be changed. The reset link may have expired; request a new link and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const requesting = mode === 'request';
  return (
    <div className="w-full max-w-md">
      <Card className="border-2 border-gray-100 shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 rounded-full bg-cyan-50 p-3 text-[#00b4d8]">
            {requesting ? <Mail className="h-6 w-6" /> : <KeyRound className="h-6 w-6" />}
          </div>
          <CardTitle>{requesting ? 'Reset your password' : 'Choose a new password'}</CardTitle>
          <CardDescription>
            {requesting ? 'Enter your registered Qilly email address.' : 'Use a strong password that you do not use on another service.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={requesting ? requestReset : updatePassword} className="space-y-4">
            {requesting ? (
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email address</Label>
                <Input id="reset-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New password</Label>
                  <Input id="new-password" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm new password</Label>
                  <Input id="confirm-password" type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
                </div>
                <p className="text-xs text-gray-500">Minimum 8 characters with uppercase, lowercase, a number and a special character.</p>
              </>
            )}
            {error && <div role="alert" className="rounded bg-red-50 p-3 text-sm text-red-700">{error}</div>}
            {message && <div role="status" className="rounded bg-green-50 p-3 text-sm text-green-700">{message}</div>}
            <Button type="submit" className="w-full" disabled={isLoading || (requesting && !email.trim())}>
              {isLoading ? 'Please wait...' : requesting ? 'Send reset link' : 'Save new password'}
            </Button>
            <Button type="button" variant="ghost" className="w-full" onClick={onBack} disabled={isLoading}>
              <ArrowLeft className="mr-2 h-4 w-4" /> {requesting ? 'Back to sign in' : 'Cancel'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
