import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">
              Cara Kerja <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500">BlajarPlus</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Platform yang menghubungkan pelajar dengan tutor berkualitas dengan mudah, aman, dan terpercaya
            </p>
          </div>
        </section>

        {/* For Students */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Untuk Pelajar</h2>
              <p className="text-xl text-gray-600">Temukan tutor terbaik dalam 4 langkah mudah</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg">
                  1
                </div>
                <h3 className="text-xl font-bold mb-3">Daftar Gratis</h3>
                <p className="text-gray-600">
                  Buat akun dengan email atau Google. Gratis dan hanya butuh 1 menit.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg">
                  2
                </div>
                <h3 className="text-xl font-bold mb-3">Cari Tutor</h3>
                <p className="text-gray-600">
                  Filter berdasarkan mata pelajaran, lokasi, harga, dan rating untuk menemukan tutor yang tepat.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg">
                  3
                </div>
                <h3 className="text-xl font-bold mb-3">Booking & Bayar</h3>
                <p className="text-gray-600">
                  Pilih jadwal yang sesuai, lakukan pembayaran dengan aman melalui sistem escrow kami.
                </p>
              </div>

              {/* Step 4 */}
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg">
                  4
                </div>
                <h3 className="text-xl font-bold mb-3">Mulai Belajar</h3>
                <p className="text-gray-600">
                  Belajar online atau offline sesuai pilihan. Berikan review setelah selesai.
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link href="/register">
                <Button size="lg" className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800">
                  Daftar Sebagai Pelajar
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* For Tutors */}
        <section className="py-20 bg-gradient-to-br from-secondary-50 to-accent-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Untuk Tutor</h2>
              <p className="text-xl text-gray-600">Mulai mengajar dan dapatkan penghasilan</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg">
                  1
                </div>
                <h3 className="text-xl font-bold mb-3">Daftar & Verifikasi</h3>
                <p className="text-gray-600">
                  Buat akun tutor dan lengkapi profil. Tim kami akan verifikasi dalam 1-2 hari.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg">
                  2
                </div>
                <h3 className="text-xl font-bold mb-3">Atur Profil</h3>
                <p className="text-gray-600">
                  Tambahkan mata pelajaran, pengalaman, dan tentukan harga per jam Anda.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg">
                  3
                </div>
                <h3 className="text-xl font-bold mb-3">Terima Booking</h3>
                <p className="text-gray-600">
                  Siswa akan menemukan profil Anda. Terima atau tolak booking sesuai jadwal.
                </p>
              </div>

              {/* Step 4 */}
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg">
                  4
                </div>
                <h3 className="text-xl font-bold mb-3">Mengajar & Dibayar</h3>
                <p className="text-gray-600">
                  Ajarkan siswa Anda. Pembayaran otomatis masuk ke rekening setelah les selesai.
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link href="/become-tutor">
                <Button size="lg" className="bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700">
                  Daftar Sebagai Tutor
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Fitur Unggulan</h2>
              <p className="text-xl text-gray-600">Kemudahan yang kami tawarkan</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-8 rounded-2xl border-2 border-primary-200">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-xl font-bold mb-3">Pembayaran Aman</h3>
                <p className="text-gray-700">
                  Sistem escrow memastikan uang Anda aman. Pembayaran hanya diteruskan ke tutor setelah les selesai.
                </p>
              </div>

              <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 p-8 rounded-2xl border-2 border-secondary-200">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-xl font-bold mb-3">Chat Langsung</h3>
                <p className="text-gray-700">
                  Komunikasi langsung dengan tutor sebelum booking. Tanyakan apapun yang ingin Anda ketahui.
                </p>
              </div>

              <div className="bg-gradient-to-br from-accent-50 to-accent-100 p-8 rounded-2xl border-2 border-accent-200">
                <div className="text-4xl mb-4">⭐</div>
                <h3 className="text-xl font-bold mb-3">Review & Rating</h3>
                <p className="text-gray-700">
                  Lihat review dari siswa lain. Berikan feedback untuk membantu tutor berkembang.
                </p>
              </div>

              <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-8 rounded-2xl border-2 border-primary-200">
                <div className="text-4xl mb-4">📅</div>
                <h3 className="text-xl font-bold mb-3">Jadwal Fleksibel</h3>
                <p className="text-gray-700">
                  Pilih waktu yang sesuai dengan jadwal Anda. Belajar online atau offline sesuai preferensi.
                </p>
              </div>

              <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 p-8 rounded-2xl border-2 border-secondary-200">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-bold mb-3">Tutor Terverifikasi</h3>
                <p className="text-gray-700">
                  Semua tutor melalui proses verifikasi. Kualitas pengajaran terjamin.
                </p>
              </div>

              <div className="bg-gradient-to-br from-accent-50 to-accent-100 p-8 rounded-2xl border-2 border-accent-200">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-bold mb-3">Harga Transparan</h3>
                <p className="text-gray-700">
                  Tidak ada biaya tersembunyi. Harga yang tertera adalah harga final yang Anda bayar.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Pertanyaan Umum</h2>
              <p className="text-xl text-gray-600">Yang sering ditanyakan</p>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-bold mb-2">Apakah gratis mendaftar?</h3>
                <p className="text-gray-600">
                  Ya, pendaftaran 100% gratis baik untuk pelajar maupun tutor. Tidak ada biaya bulanan atau biaya tersembunyi.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-bold mb-2">Bagaimana cara pembayaran?</h3>
                <p className="text-gray-600">
                  Kami menggunakan sistem escrow dengan payment gateway Midtrans. Anda bisa bayar dengan transfer bank, kartu kredit, atau e-wallet.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-bold mb-2">Apakah bisa refund jika cancel?</h3>
                <p className="text-gray-600">
                  Ya, jika Anda cancel lebih dari 24 jam sebelum jadwal les, Anda akan mendapat full refund. Cancel kurang dari 24 jam tidak bisa refund.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-bold mb-2">Berapa komisi untuk tutor?</h3>
                <p className="text-gray-600">
                  Platform mengambil komisi 15% dari setiap transaksi. Tutor menerima 85% dari harga yang ditetapkan.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-bold mb-2">Apakah tutor sudah terverifikasi?</h3>
                <p className="text-gray-600">
                  Ya, semua tutor melalui proses verifikasi identitas dan kualifikasi. Hanya tutor terverifikasi yang bisa menerima booking.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Siap Memulai Perjalanan Belajar Anda?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Bergabunglah dengan ribuan pelajar dan tutor yang telah merasakan kemudahan BlajarPlus
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-white text-primary-700 hover:bg-gray-100">
                  Daftar Sekarang
                </Button>
              </Link>
              <Link href="/search">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10">
                  Cari Tutor
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
