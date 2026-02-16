"use client";

import { 
  LayoutDashboard, 
  Send, 
  History, 
  Settings, 
  LogOut 
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LogoutModal from "./LogoutModal";

export default function Sidebar() {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <aside className="w-64 bg-gradient-to-b from-green-800 to-emerald-700 text-white flex flex-col p-6 h-screen fixed left-0 top-0">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
           <span className="text-green-700 font-bold text-xs">IGO</span>
        </div>
        <h1 className="text-xl font-bold tracking-tight">IGO BANK</h1>
      </div>

      <nav className="flex-grow space-y-2">
        <NavItem 
          href="/dashboard" 
          icon={<LayoutDashboard size={20} />} 
          label="Dashboard" 
          active={pathname === "/dashboard"} 
        />
        <NavItem 
          href="/dashboard/transfer" 
          icon={<Send size={20} />} 
          label="Transfer" 
          active={pathname === "/dashboard/transfer"} 
        />
        <NavItem 
          href="/dashboard/transactions" 
          icon={<History size={20} />} 
          label="Transactions" 
          active={pathname === "/dashboard/transactions"} 
        />
        <NavItem 
          href="/dashboard/settings" 
          icon={<Settings size={20} />} 
          label="Settings" 
          active={pathname === "/dashboard/settings"} 
        />
      </nav>

      {/* sign out */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-3 px-4 py-3 opacity-70 hover:opacity-100 transition-all mt-auto border-t border-white/10 pt-6 w-full text-left"
      >
        <LogOut size={20} />
        <span className="font-medium">Sign Out</span>
      </button>


      {/* 로그아웃 모달 */}
      <LogoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </aside>
  );
}

function NavItem({ icon, label, href, active = false }: { icon: any, label: string, href: string, active?: boolean }) {
  return (
    <Link href={href} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
      active ? "bg-white/20 font-bold" : "hover:bg-white/10 opacity-70"
    }`}>
      {icon}
      <span>{label}</span>
    </Link>
  );
}
