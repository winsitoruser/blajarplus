import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';

export default function BecomeTutorPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-secondary-50 via-white to-accent-50 py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block px-4 py-2 bg-secondary-100 text-secondary-700 rounded-full text-sm font-semibold mb-6">
                  💼 Peluang Karir
                </div>
                <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                  Jadi Tutor di{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-600 to-accent-500">
                    BlajarPlus
                  </span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Bagikan ilmu Anda, bantu siswa meraih prestasi, dan dapatkan penghasilan tambahan dengan fleksibilitas waktu yang Anda tentukan sendiri.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/register?role=tutor">
                    <Button size="lg" className="bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 shadow-lg">
                      Daftar Sebagai Tutor →
                    </Button>
                  </Link>
                  <Link href="/how-it-works">
                    <Button size="lg" variant="outline" className="border-2 border-secondary-600 text-secondary-600 hover:bg-secondary-50">
                      Cara Kerja
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="bg-white rounded-3xl shadow-2xl p-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-secondary-50 to-accent-50 rounded-xl">
                      <div className="w-12 h-12 bg-secondary-500 rounded-full flex items-center justify-center text-white text-2xl">
                        💰
                      </div>
                      <div>
                        <div className="font-semibold">Penghasilan Fleksibel</div>
                        <div className="text-sm text-gray-600">Tentukan harga Anda sendiri</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-accent-50 to-primary-50 rounded-xl">
                      <div className="w-12 h-12 bg-accent-500 rounded-full flex items-center justify-center text-white text-2xl">
                        📅
                      </div>
                      <div>
                        <div className="font-semibold">Jadwal Fleksibel</div>
                        <div className="text-sm text-gray-600">Atur waktu mengajar sendiri</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl">
                      <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white text-2xl">
                        🎯
                      </div>
                      <div>
                        <div className="font-semibold">Platform Terpercaya</div>
                        <div className="text-sm text-gray-600">Pembayaran aman & tepat waktu</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Keuntungan Jadi Tutor</h2>
              <p className="text-xl text-gray-600">Mengapa bergabung dengan BlajarPlus?</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="group hover:scale-105 transition-transform duration-300">
                <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 p-8 rounded-2xl h-full border-2 border-secondary-200 hover:border-secondary-400 transition-colors">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow">
                    <span className="text-3xl">💵</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">Penghasilan Menarik</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Dapatkan Rp 50.000 - Rp 300.000 per jam. Anda yang tentukan harga sesuai pengalaman dan keahlian Anda.
                  </p>
                </div>
              </div>

              <div className="group hover:scale-105 transition-transform duration-300">
                <div className="bg-gradient-to-br from-accent-50 to-accent-100 p-8 rounded-2xl h-full border-2 border-accent-200 hover:border-accent-400 transition-colors">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow">
                    <span className="text-3xl">⏰</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">Waktu Fleksibel</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Atur jadwal mengajar sesuai ketersediaan Anda. Cocok untuk mahasiswa, profesional, atau ibu rumah tangga.
                  </p>
                </div>
              </div>

              <div className="group hover:scale-105 transition-transform duration-300">
                <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-8 rounded-2xl h-full border-2 border-primary-200 hover:border-primary-400 transition-colors">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow">
                    <span className="text-3xl">🏠</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">Mengajar dari Rumah</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Ajarkan siswa secara online dari kenyamanan rumah Anda. Hemat waktu dan biaya transportasi.
                  </p>
                </div>
              </div>

              <div className="group hover:scale-105 transition-transform duration-300">
                <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-8 rounded-2xl h-full border-2 border-primary-200 hover:border-primary-400 transition-colors">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow">
                    <span className="text-3xl">🎓</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">Kembangkan Skill</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Tingkatkan kemampuan mengajar dan komunikasi Anda sambil membantu siswa mencapai tujuan mereka.
                  </p>
                </div>
              </div>

              <div className="group hover:scale-105 transition-transform duration-300">
                <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 p-8 rounded-2xl h-full border-2 border-secondary-200 hover:border-secondary-400 transition-colors">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow">
                    <span className="text-3xl">🤝</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">Dukungan Penuh</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Tim support kami siap membantu 24/7. Kami juga menyediakan panduan dan tips mengajar.
                  </p>
                </div>
              </div>

              <div className="group hover:scale-105 transition-transform duration-300">
                <div className="bg-gradient-to-br from-accent-50 to-accent-100 p-8 rounded-2xl h-full border-2 border-accent-200 hover:border-accent-400 transition-colors">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow">
                    <span className="text-3xl">🔒</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">Pembayaran Aman</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Sistem escrow menjamin pembayaran Anda aman. Transfer langsung ke rekening setelah les selesai.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section className="py-20 bg-gradient-to-br from-primary-50 to-secondary-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Persyaratan</h2>
              <p className="text-xl text-gray-600">Yang Anda butuhkan untuk menjadi tutor</p>
            </div>

            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">✓</span>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Keahlian di Bidang Tertentu</h3>
                  <p className="text-gray-600">Minimal menguasai 1 mata pelajaran dengan baik</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">✓</span>
                </div>
                <div>
                  <h3 className="font-bold mb-2">KTP/Identitas Valid</h3>
                  <p className="text-gray-600">Untuk proses verifikasi akun</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">✓</span>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Rekening Bank</h3>
                  <p className="text-gray-600">Untuk menerima pembayaran</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">✓</span>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Koneksi Internet</h3>
                  <p className="text-gray-600">Untuk mengajar online (jika dipilih)</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">✓</span>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Komitmen Mengajar</h3>
                  <p className="text-gray-600">Dedikasi untuk membantu siswa belajar</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">✓</span>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Komunikatif & Sabar</h3>
                  <p className="text-gray-600">Mampu menjelaskan dengan baik</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How to Start */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Cara Memulai</h2>
              <p className="text-xl text-gray-600">Hanya 4 langkah mudah</p>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
              <div className="flex gap-6 items-start">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Daftar Akun</h3>
                  <p className="text-gray-600 text-lg">
                    Klik tombol "Daftar Sebagai Tutor" dan isi formulir pendaftaran dengan lengkap. Proses hanya 5 menit.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Lengkapi Profil</h3>
                  <p className="text-gray-600 text-lg">
                    Upload foto, tambahkan pengalaman, pendidikan, dan mata pelajaran yang Anda kuasai. Semakin lengkap, semakin menarik!
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Verifikasi</h3>
                  <p className="text-gray-600 text-lg">
                    Tim kami akan review profil dan dokumen Anda. Proses verifikasi biasanya selesai dalam 1-2 hari kerja.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Mulai Mengajar</h3>
                  <p className="text-gray-600 text-lg">
                    Setelah terverifikasi, profil Anda akan muncul di pencarian. Terima booking dan mulai mengajar!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Kata Tutor Kami</h2>
              <p className="text-xl text-gray-600">Pengalaman tutor yang sudah bergabung</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-white p-8 rounded-2xl shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center text-2xl">
                    👩‍🏫
                  </div>
                  <div>
                    <div className="font-bold">Sarah M.</div>
                    <div className="text-sm text-gray-600">Tutor Matematika</div>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  "Platform yang sangat membantu! Saya bisa mengajar dari rumah dengan jadwal fleksibel. Pembayaran selalu tepat waktu."
                </p>
                <div className="mt-4 text-yellow-500">★★★★★</div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center text-2xl">
                    👨‍🏫
                  </div>
                  <div>
                    <div className="font-bold">Budi S.</div>
                    <div className="text-sm text-gray-600">Tutor Bahasa Inggris</div>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  "Sudah 6 bulan mengajar di BlajarPlus. Penghasilan tambahan yang lumayan dan bisa bantu banyak siswa."
                </p>
                <div className="mt-4 text-yellow-500">★★★★★</div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center text-2xl">
                    👩‍🏫
                  </div>
                  <div>
                    <div className="font-bold">Rina K.</div>
                    <div className="text-sm text-gray-600">Tutor Fisika</div>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  "Sistem yang mudah digunakan. Support team juga responsif. Recommended untuk yang ingin jadi tutor!"
                </p>
                <div className="mt-4 text-yellow-500">★★★★★</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-r from-secondary-600 via-secondary-700 to-accent-600">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Siap Berbagi Ilmu dan Dapatkan Penghasilan?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Bergabunglah dengan 1000+ tutor yang telah mengajar dan mendapatkan penghasilan melalui BlajarPlus
            </p>
            <Link href="/register?role=tutor">
              <Button size="lg" className="bg-white text-secondary-700 hover:bg-gray-100 shadow-xl text-lg px-10">
                Daftar Sebagai Tutor Sekarang →
              </Button>
            </Link>
            <p className="mt-6 text-white/80">Gratis mendaftar • Verifikasi 1-2 hari • Mulai mengajar</p>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
