'use client';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  return (
    <nav className="sticky top-0 z-10 flex items-center justify-between bg-slate-900 p-3 text-white">
      <div className="font-semibold">Snack Sales</div>
      <div className="flex gap-3 text-sm">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/pelanggan">Pelanggan</Link>
        <Link href="/barang">Barang</Link>
        <button onClick={logout}>{user?.nama_lengkap || 'Logout'}</button>
      </div>
    </nav>
  );
}
