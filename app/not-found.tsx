import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center border border-gray-100">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Page Not Found</h2>

        <p className="text-gray-500 mb-8 leading-relaxed">
          Oops! The page you are looking for does not exist or has been moved.
        </p>

        <Link
          href="/dashboard"
          className="block w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-200 transition-all active:scale-[0.98]"
        >
          Return Home
        </Link>
      </div>

      <div className="mt-8 flex items-center gap-2 opacity-60">
        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center border border-gray-200">
          <span className="text-green-700 font-bold text-[8px]">IGO</span>
        </div>
        <span className="text-sm font-semibold text-gray-500">IGO BANK</span>
      </div>
    </div>
  );
}