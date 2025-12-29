import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">
              Blajar<span className="text-secondary">Plus</span>
            </h3>
            <p className="text-gray-400">
              Platform terpercaya untuk menemukan tutor berkualitas di Indonesia.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Untuk Student</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/search" className="hover:text-white transition">
                  Cari Tutor
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-white transition">
                  Cara Kerja
                </Link>
              </li>
              <li>
                <Link href="/subjects" className="hover:text-white transition">
                  Mata Pelajaran
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Untuk Tutor</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/become-tutor" className="hover:text-white transition">
                  Jadi Tutor
                </Link>
              </li>
              <li>
                <Link href="/tutor-guide" className="hover:text-white transition">
                  Panduan Tutor
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition">
                  Biaya & Komisi
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Perusahaan</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/about" className="hover:text-white transition">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Kontak
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition">
                  Syarat & Ketentuan
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} BlajarPlus. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
