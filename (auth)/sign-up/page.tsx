'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Zap, Mail, Lock, User, Building2, Users, ShieldCheck, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type Role = 'CREATOR' | 'BRAND' | 'ADMIN';

const ROLES = [
  {
    id: 'CREATOR' as Role,
    icon: Users,
    title: 'Content Creator',
    description: 'I create content and want to collaborate with brands',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'BRAND' as Role,
    icon: Building2,
    title: 'Brand / Company',
    description: 'I represent a brand looking to work with influencers',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'ADMIN' as Role,
    icon: ShieldCheck,
    title: 'Broker / Admin',
    description: 'I manage campaigns and oversee the platform',
    color: 'from-orange-500 to-amber-500',
  },
];

export default function SignUpPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { toast } = useToast();
  const defaultRole = (params.get('role') as Role) || null;

  const [step, setStep] = useState<'role' | 'details'>(defaultRole ? 'details' : 'role');
  const [selectedRole, setSelectedRole] = useState<Role | null>(defaultRole);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  async function handleRoleSelect(role: Role) {
    setSelectedRole(role);
    setStep('details');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedRole) return;
    if (form.password.length < 8) {
      toast({ title: 'Password too short', description: 'Password must be at least 8 characters.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, role: selectedRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      // Auto sign-in
      await signIn('credentials', { email: form.email, password: form.password, redirect: false });
      router.push(selectedRole === 'CREATOR' ? '/creator' : selectedRole === 'BRAND' ? '/brand' : '/admin');
    } catch (err: any) {
      toast({ title: 'Registration failed', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    await signIn('google', { callbackUrl: '/' });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl gradient-purple-pink flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">InfluenceHub</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="mt-1 text-gray-500 text-sm">
            {step === 'role' ? 'Choose how you\'ll use InfluenceHub' : `Signing up as ${ROLES.find(r => r.id === selectedRole)?.title}`}
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {['role', 'details'].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={cn('h-7 w-7 rounded-full flex items-center justify-center text-xs font-medium transition-all',
                step === s ? 'gradient-purple-pink text-white' :
                (i < ['role', 'details'].indexOf(step) ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'))}>
                {i < ['role', 'details'].indexOf(step) ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </div>
              {i < 1 && <div className={cn('h-px w-8', step === 'details' ? 'bg-purple-300' : 'bg-gray-200')} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {step === 'role' && (
            <div className="space-y-3">
              {ROLES.map((role) => (
                <button key={role.id} onClick={() => handleRoleSelect(role.id)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/50 transition-all text-left group">
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center flex-shrink-0`}>
                    <role.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">{role.title}</div>
                    <div className="text-sm text-gray-500">{role.description}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {step === 'details' && (
            <>
              <Button variant="outline" size="sm" className="mb-6 border-gray-200" onClick={() => setStep('role')}>
                ← Change role
              </Button>

              <Button variant="outline" className="w-full h-11 border-gray-200 mb-4" onClick={handleGoogle}>
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100" /></div>
                <div className="relative flex justify-center text-xs text-gray-400"><span className="bg-white px-2">or sign up with email</span></div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">{selectedRole === 'BRAND' ? 'Company name' : 'Full name'}</Label>
                  <div className="relative mt-1">
                    {selectedRole === 'BRAND' ? <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      : <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />}
                    <Input id="name" placeholder={selectedRole === 'BRAND' ? 'Acme Inc.' : 'Jane Doe'} className="pl-10"
                      value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input id="email" type="email" placeholder="you@example.com" className="pl-10"
                      value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input id="password" type={showPass ? 'text' : 'password'} placeholder="Min. 8 characters" className="pl-10 pr-10"
                      value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required minLength={8} />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full gradient-purple-pink text-white border-0 hover:opacity-90 h-11" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Create account
                </Button>
                <p className="text-center text-xs text-gray-400">
                  By signing up, you agree to our{' '}
                  <a href="#" className="underline hover:text-gray-600">Terms</a> and{' '}
                  <a href="#" className="underline hover:text-gray-600">Privacy Policy</a>.
                </p>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link href="/sign-in" className="text-purple-600 font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
