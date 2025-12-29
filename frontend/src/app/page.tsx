import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 py-24 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-6">
                🎓 Platform Edukasi #1 di Indonesia
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Belajar Lebih Mudah dengan{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500">
                  Tutor Terbaik
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Temukan tutor profesional yang sesuai dengan kebutuhan belajar Anda. 
                Fleksibel, terpercaya, dan berkualitas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/search">
                  <Button size="lg" className="text-lg px-8 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg">
                    Mulai Belajar →
                  </Button>
                </Link>
                <Link href="/become-tutor">
                  <Button size="lg" variant="outline" className="text-lg px-8 border-2 border-primary-600 text-primary-600 hover:bg-primary-50">
                    Jadi Tutor
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✓</span>
                  <span>1000+ Tutor</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✓</span>
                  <span>Terverifikasi</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✓</span>
                  <span>Aman & Terpercaya</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-3xl transform rotate-6 opacity-20"></div>
                <div className="relative bg-white rounded-3xl shadow-2xl p-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl">
                      <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white text-xl">
                        👨‍🏫
                      </div>
                      <div>
                        <div className="font-semibold">Matematika</div>
                        <div className="text-sm text-gray-600">150+ Tutor Tersedia</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-secondary-50 to-accent-50 rounded-xl">
                      <div className="w-12 h-12 bg-secondary-500 rounded-full flex items-center justify-center text-white text-xl">
                        🌍
                      </div>
                      <div>
                        <div className="font-semibold">Bahasa Inggris</div>
                        <div className="text-sm text-gray-600">200+ Tutor Tersedia</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-accent-50 to-primary-50 rounded-xl">
                      <div className="w-12 h-12 bg-accent-500 rounded-full flex items-center justify-center text-white text-xl">
                        💻
                      </div>
                      <div>
                        <div className="font-semibold">Programming</div>
                        <div className="text-sm text-gray-600">80+ Tutor Tersedia</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Kenapa <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500">BlajarPlus</span>?
            </h2>
            <p className="text-xl text-gray-600">Platform terpercaya untuk pembelajaran berkualitas</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group hover:scale-105 transition-transform duration-300">
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-8 rounded-2xl h-full border-2 border-primary-200 hover:border-primary-400 transition-colors">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow">
                  <span className="text-3xl">✓</span>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Tutor Terverifikasi</h3>
                <p className="text-gray-700 leading-relaxed">
                  Semua tutor melalui proses seleksi dan verifikasi ketat untuk memastikan kualitas pengajaran terbaik
                </p>
              </div>
            </div>

            <div className="group hover:scale-105 transition-transform duration-300">
              <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 p-8 rounded-2xl h-full border-2 border-secondary-200 hover:border-secondary-400 transition-colors">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow">
                  <span className="text-3xl">🔒</span>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Pembayaran Aman</h3>
                <p className="text-gray-700 leading-relaxed">
                  Sistem escrow dan payment gateway terpercaya menjamin keamanan transaksi Anda
                </p>
              </div>
            </div>

            <div className="group hover:scale-105 transition-transform duration-300">
              <div className="bg-gradient-to-br from-accent-50 to-accent-100 p-8 rounded-2xl h-full border-2 border-accent-200 hover:border-accent-400 transition-colors">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow">
                  <span className="text-3xl">📊</span>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Fleksibel & Mudah</h3>
                <p className="text-gray-700 leading-relaxed">
                  Pilih jadwal sesuai keinginan, belajar online atau offline, dan pantau progress dengan mudah
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Siap Tingkatkan Prestasi Belajar?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan ribuan pelajar yang telah meraih kesuksesan bersama tutor terbaik kami
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="text-lg px-10 bg-white text-primary-700 hover:bg-gray-100 shadow-xl">
                Daftar Gratis Sekarang
              </Button>
            </Link>
            <Link href="/search">
              <Button size="lg" variant="outline" className="text-lg px-10 border-2 border-white text-white hover:bg-white/10">
                Lihat Tutor
              </Button>
            </Link>
          </div>
          <div className="mt-12 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-white/80">Tutor Aktif</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">5000+</div>
              <div className="text-white/80">Siswa Puas</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">4.8★</div>
              <div className="text-white/80">Rating Platform</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
