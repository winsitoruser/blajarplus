'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authApi } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authApi.login(formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Redirect based on role
      const user = response.data.user;
      if (user.role === 'admin') {
        router.push('/admin/dashboard');
      } else if (user.role === 'tutor') {
        router.push('/tutor/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role: 'student' | 'tutor') => {
    const mockUser = {
      id: `demo-${role}-${Date.now()}`,
      email: `demo-${role}@blajarplus.com`,
      fullName: role === 'student' ? 'Demo Student' : 'Demo Tutor',
      role: role,
      status: 'active',
      avatarUrl: null,
    };

    localStorage.setItem('token', 'demo-token-' + Date.now());
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            BlajarPlus
          </h1>
          <p className="text-gray-600 mt-2">Platform Belajar Online Terpercaya</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold text-center">Masuk</CardTitle>
            <CardDescription className="text-center">
              Masukkan kredensial Anda untuk melanjutkan
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="emailOrPhone" className="text-sm font-medium text-gray-700 block">
                  Email atau Nomor Telepon
                </label>
                <Input
                  id="emailOrPhone"
                  type="text"
                  placeholder="email@example.com atau 08123456789"
                  value={formData.emailOrPhone}
                  onChange={(e) => setFormData({ ...formData, emailOrPhone: e.target.value })}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700 block">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-xs text-blue-600 hover:text-blue-700">
                    Lupa password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="w-full"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium" 
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memproses...
                  </span>
                ) : 'Masuk'}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Atau</span>
                </div>
              </div>

              <Button type="button" variant="outline" className="w-full h-11 border-gray-300">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC04" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Masuk dengan Google
              </Button>

              <div className="text-center pt-4">
                <p className="text-sm text-gray-600">
                  Belum punya akun?{' '}
                  <Link href="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                    Daftar sekarang
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Test Credentials */}
        <div className="mt-6 p-4 bg-white rounded-lg shadow border border-gray-200">
          <p className="text-xs font-semibold text-gray-700 mb-2 text-center">🔐 Test Credentials</p>
          <div className="space-y-1 text-xs text-gray-600">
            <p><span className="font-medium">Admin:</span> admin@blajarplus.com / Test123!</p>
            <p><span className="font-medium">Tutor:</span> tutor1@test.com / Test123!</p>
            <p><span className="font-medium">Student:</span> student1@test.com / Test123!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
