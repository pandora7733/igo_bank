import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, Globe } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
            IGO
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">IGO BANK</span>
        </div>
        <div className="flex gap-4">
          <Link
            href="/Auth/signin"
            className="px-6 py-2.5 text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/Auth/signup"
            className="px-6 py-2.5 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-all shadow-lg shadow-green-200"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-8 pt-20 pb-32">
        <div className="grid grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-block px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-bold border border-green-100">
              Future of Banking
            </div>
            <h1 className="text-6xl font-extrabold text-gray-900 leading-tight">
              Banking Made <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
                Simple & Secure
              </span>
            </h1>
            <p className="text-xl text-gray-500 leading-relaxed max-w-lg">
              Experience the next generation of digital banking. Fast transfers, secure transactions, and powerful insights all in one place.
            </p>
            <div className="flex gap-4 pt-4">
              <Link
                href="" //  "/Auth/signup"
                className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all flex items-center gap-2"
              >
                Open Account <ArrowRight size={20} />
              </Link>
              <Link
                href="" //  "/dashboard"
                className="px-8 py-4 bg-gray-50 text-gray-900 rounded-2xl font-bold hover:bg-gray-100 transition-all border border-gray-200"
              >
                View Demo
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-gradient-to-tr from-green-100 to-emerald-50 rounded-full blur-3xl opacity-50" />
            <div className="relative z-10 bg-white p-4 rounded-[40px] shadow-2xl shadow-green-100/50 border border-gray-100 rotate-[-6deg] hover:rotate-0 transition-all duration-500">
              {/* Dashboard Mockup Placeholder using Logo */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-[32px] overflow-hidden p-8 h-[500px] flex flex-col items-center justify-center border border-gray-100">
                <div className="relative w-40 h-40 mb-6">
                  <Image src="/image/IGOBANK_logo.png" alt="IGOBANK App" fill className="object-contain" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">IGO Banking App</h3>
                <p className="text-gray-400 mt-2">Anytime, Anywhere</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-32 grid grid-cols-3 gap-8">
          <FeatureCard
            icon={<ShieldCheck className="w-8 h-8 text-green-600" />}
            title="Bank-Grade Security"
            description="Your money is protected by industry-leading encryption and security protocols."
          />
          <FeatureCard
            icon={<Zap className="w-8 h-8 text-green-600" />}
            title="Instant Transfers"
            description="Send money to anyone, anywhere in seconds with zero hidden fees."
          />
          <FeatureCard
            icon={<Globe className="w-8 h-8 text-green-600" />}
            title="Global Access"
            description="Manage your finances from anywhere in the world with our mobile-first platform."
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          <p className="text-gray-400">© 2026 IGO BANK. All rights reserved.</p>
          <div className="flex gap-8 text-gray-500 text-sm font-medium">
            <Link href="#" className="hover:text-green-600 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-green-600 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-lg hover:shadow-green-50 transition-all group hover:-translate-y-1">
      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-500 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
