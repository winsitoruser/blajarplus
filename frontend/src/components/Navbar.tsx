'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export function Navbar() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    const userName = user?.fullName || 'User';
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    
    // Show logout notification
    toast({
      variant: 'success',
      title: '✅ Logout Berhasil!',
      description: `Sampai jumpa lagi, ${userName}!`,
    });
    
    // Redirect after short delay
    setTimeout(() => {
      router.push('/');
    }, 1000);
  };

  return (
    <nav className="bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
              <span className="text-2xl font-bold text-white">
                Blajar<span className="text-secondary-300">Plus</span>
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/search" className="text-white hover:text-secondary-200 transition font-medium">
              Cari Tutor
            </Link>
            <Link href="/belajar-gratis" className="text-white hover:text-secondary-200 transition font-medium">
              🌍 Belajar Gratis
            </Link>
            {isLoggedIn && (
              <Link href="/dashboard" className="text-white hover:text-secondary-200 transition font-medium">
                Dashboard
              </Link>
            )}
            <Link href="/how-it-works" className="text-white hover:text-secondary-200 transition font-medium">
              Cara Kerja
            </Link>
            <Link href="/become-tutor" className="text-white hover:text-secondary-200 transition font-medium">
              Jadi Tutor
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <span className="text-white text-sm font-medium">Halo, {user?.fullName || 'User'}</span>
                <Button 
                  onClick={handleLogout}
                  variant="ghost" 
                  className="text-white hover:bg-white/20 border-white/30"
                >
                  Keluar
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-white hover:bg-white/20 border-white/30">Masuk</Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-secondary-500 hover:bg-secondary-600 text-white">Daftar</Button>
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:text-secondary-200"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/20 bg-primary-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/search"
              className="block px-3 py-2 text-white hover:bg-white/10 rounded-md font-medium"
            >
              Cari Tutor
            </Link>
            {isLoggedIn && (
              <Link
                href="/dashboard"
                className="block px-3 py-2 text-white hover:bg-white/10 rounded-md font-medium"
              >
                Dashboard
              </Link>
            )}
            <Link
              href="/how-it-works"
              className="block px-3 py-2 text-white hover:bg-white/10 rounded-md font-medium"
            >
              Cara Kerja
            </Link>
            <Link
              href="/become-tutor"
              className="block px-3 py-2 text-white hover:bg-white/10 rounded-md font-medium"
            >
              Jadi Tutor
            </Link>
            <div className="pt-4 pb-2 space-y-2">
              {isLoggedIn ? (
                <>
                  <div className="px-3 py-2 text-white text-sm font-medium">
                    Halo, {user?.fullName || 'User'}
                  </div>
                  <Button 
                    onClick={handleLogout}
                    variant="ghost" 
                    className="w-full text-white hover:bg-white/20 border-white/30"
                  >
                    Keluar
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block">
                    <Button variant="ghost" className="w-full text-white hover:bg-white/20 border-white/30">Masuk</Button>
                  </Link>
                  <Link href="/register" className="block">
                    <Button className="w-full bg-secondary-500 hover:bg-secondary-600">Daftar</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
