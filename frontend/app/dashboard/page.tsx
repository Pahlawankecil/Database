'use client';

import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  Bell,
  Calendar as CalendarIcon,
  ChevronRight,
  CreditCard,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Package,
  PieChart,
  Settings,
  ShoppingCart,
  Sun,
  TrendingUp,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import { api } from '@/lib/api';

type SummaryResponse = {
  totalPenjualanHariIni: number;
  totalHutangBelumLunas: number;
  jumlahPelangganAktif: number;
  jumlahBarang: number;
  stokKritis: number;
  recentTransaksi: Array<{
    id: number;
    nomor_nota: string;
    pelanggan: string;
    status: 'Lunas' | 'Hutang' | 'Cicilan';
    nominal: number;
  }>;
};

const rupiah = (v: number) => `Rp ${Number(v || 0).toLocaleString('id-ID')}`;

export default function DashboardPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const { data, isLoading } = useQuery<SummaryResponse>({
    queryKey: ['summary-modern'],
    queryFn: async () => (await api.get('/dashboard/summary')).data,
  });

  const stats = useMemo(
    () => [
      { title: 'Omzet Hari Ini', value: rupiah(data?.totalPenjualanHariIni || 0), icon: ShoppingCart, trend: '+12%', color: 'emerald' as const },
      { title: 'Piutang Aktif', value: rupiah(data?.totalHutangBelumLunas || 0), icon: CreditCard, trend: '-5%', color: 'rose' as const },
      { title: 'Total Pelanggan', value: String(data?.jumlahPelangganAktif || 0), icon: Users, trend: '+2', color: 'amber' as const },
      { title: 'Stok Kritis', value: `${data?.stokKritis || 0} Item`, icon: Package, trend: 'Cek Segera', color: 'orange' as const },
    ],
    [data],
  );

  const notifItems = [
    { icon: <TrendingUp size={16} className="text-emerald-500" />, title: 'Target Tercapai', desc: 'Omzet hari ini bergerak positif dibanding kemarin.', time: '10m' },
    { icon: <Package size={16} className="text-rose-500" />, title: 'Stok Menipis', desc: `${data?.stokKritis || 0} barang berada pada stok minimum.`, time: '2j' },
    { icon: <History size={16} className="text-amber-500" />, title: 'Piutang Aktif', desc: `Total piutang aktif saat ini ${rupiah(data?.totalHutangBelumLunas || 0)}.`, time: '5j' },
  ];

  return (
    <div className="min-h-screen font-sans transition-colors duration-500 bg-[#f8fafc] dark:bg-[#020617] text-slate-900 dark:text-slate-100 overflow-x-hidden">
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-[#0f172a] border-r border-slate-200 dark:border-slate-800/50 transform transition-all duration-500 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 shadow-2xl lg:shadow-none`}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-12 h-12 bg-gradient-to-tr from-emerald-600 to-teal-400 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
              <Wallet size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter">AMANAH<span className="text-emerald-600">POS</span></h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Management Berkah</p>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden ml-auto p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400"><X size={20} /></button>
          </div>

          <nav className="space-y-1 flex-grow overflow-y-auto pr-2">
            <div className="pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-4">Menu Utama</div>
            <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
            <NavItem icon={<ShoppingCart size={20} />} label="Kasir (POS)" />
            <NavItem icon={<Package size={20} />} label="Stok Barang" />
            <NavItem icon={<Users size={20} />} label="Pelanggan" />
            <div className="pt-6 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-4">Keuangan</div>
            <NavItem icon={<History size={20} />} label="Riwayat Hutang" />
            <NavItem icon={<PieChart size={20} />} label="Laporan Laba" />
            <div className="pt-6 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-4">Sistem</div>
            <NavItem icon={<Settings size={20} />} label="Pengaturan" />
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800">
            <button className="flex items-center justify-between w-full p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-600 rounded-2xl font-bold text-sm group">
              <div className="flex items-center gap-3"><LogOut size={18} />Keluar Sesi</div>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </aside>

      <main className="lg:ml-72 min-h-screen p-4 md:p-8 transition-all duration-500">
        <header className="flex items-center justify-between mb-8 sticky top-0 z-30 py-2">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800"><Menu size={24} /></button>
            <div className="hidden sm:block">
              <h2 className="text-2xl font-black tracking-tight">Ahlan wa Sahlan, <span className="text-emerald-600 font-serif">Admin</span></h2>
              <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mt-0.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Sistem Beroperasi Normal
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-4 bg-white dark:bg-slate-900 px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex flex-col items-end leading-none border-r border-slate-100 dark:border-slate-800 pr-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Waktu</span>
                <span className="text-lg font-mono font-black text-emerald-600 tracking-tight">{currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
              </div>
              <button onClick={() => setIsDarkMode((x) => !x)} className="p-2 text-slate-400 hover:text-emerald-600">{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}</button>
            </div>
            <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-2xl border-2 border-white dark:border-slate-900 shadow-md overflow-hidden cursor-pointer hover:scale-105 transition-transform">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
          <div className="xl:col-span-8 space-y-6 lg:space-y-8">
            <div className="group relative overflow-hidden bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/50 rounded-[2.5rem] p-8 lg:p-10 shadow-sm">
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-4 py-1.5 bg-emerald-600 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em]">KALENDER HIJRIYAH</span>
                    <span className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Selasa</span>
                  </div>
                  <div className="flex items-baseline gap-4">
                    <h3 className="text-8xl lg:text-9xl font-black tracking-tighter text-emerald-600">7</h3>
                    <div>
                      <p className="text-3xl lg:text-4xl font-black leading-none mb-1 italic font-serif">Ramadhan</p>
                      <p className="text-xl font-bold text-slate-400">1447 H</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 pt-4 border-t border-slate-50 dark:border-slate-800">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl"><CalendarIcon size={20} className="text-emerald-500" /></div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">PENANGGALAN MASEHI</p>
                      <p className="text-base font-black text-slate-700 dark:text-slate-200 tracking-tight">24 Februari 2026</p>
                    </div>
                  </div>
                </div>
                <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-b from-emerald-50 to-transparent dark:from-emerald-900/10 rounded-[3rem] p-8 border border-emerald-100/50 dark:border-emerald-800/20">
                  <Moon size={64} className="text-emerald-600 mb-6" fill="currentColor" />
                  <p className="text-emerald-700 dark:text-emerald-400 font-serif text-xl font-bold mb-2">Ramadhan Mubarak</p>
                  <p className="text-center text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Bulan penuh berkah, pintu ampunan terbuka lebar bagi hamba-Nya yang beriman.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {stats.map((stat) => <StatCard key={stat.title} stat={stat} />)}
            </div>

            <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/50 rounded-[2.5rem] overflow-hidden shadow-sm">
              <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-transparent">
                <div>
                  <h3 className="text-xl font-black tracking-tight">Transaksi Terakhir</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Data realtime dari backend</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs">Lihat Laporan <ArrowRight size={14} /></button>
              </div>
              <div className="p-0 overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] bg-slate-50/30 dark:bg-slate-900/30">
                    <tr>
                      <th className="px-8 py-5">Kode Nota</th>
                      <th className="px-8 py-5">Nama Pelanggan</th>
                      <th className="px-8 py-5">Status Pembayaran</th>
                      <th className="px-8 py-5 text-right">Nominal</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-slate-50 dark:divide-slate-800/50">
                    {isLoading && <tr><td className="px-8 py-6 text-slate-400" colSpan={4}>Memuat data...</td></tr>}
                    {!isLoading && (data?.recentTransaksi || []).length === 0 && <tr><td className="px-8 py-6 text-slate-400" colSpan={4}>Belum ada transaksi.</td></tr>}
                    {(data?.recentTransaksi || []).map((row) => (
                      <tr key={row.id} className="group hover:bg-emerald-50/30 dark:hover:bg-emerald-500/5 transition-all cursor-pointer">
                        <td className="px-8 py-6 font-mono font-bold text-slate-400 group-hover:text-emerald-600">{row.nomor_nota}</td>
                        <td className="px-8 py-6 font-black text-slate-700 dark:text-slate-200">{row.pelanggan}</td>
                        <td className="px-8 py-6"><StatusBadge status={row.status} /></td>
                        <td className="px-8 py-6 text-right font-black text-slate-800 dark:text-slate-100">{rupiah(row.nominal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="xl:col-span-4 space-y-6 lg:space-y-8">
            <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/50 rounded-[2.5rem] p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3"><div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-xl flex items-center justify-center"><Bell size={20} /></div><h3 className="text-xl font-black tracking-tight">Notifikasi</h3></div>
                <span className="w-5 h-5 bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center rounded-lg">{notifItems.length}</span>
              </div>
              <div className="space-y-4">{notifItems.map((item) => <NotificationItem key={item.title} {...item} />)}</div>
            </div>
          </div>
        </div>
      </main>

      <div className={`fixed inset-0 bg-slate-950/60 backdrop-blur-md z-40 lg:hidden transition-opacity duration-500 ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsSidebarOpen(false)} />
    </div>
  );
}

const StatusBadge = ({ status }: { status: 'Lunas' | 'Hutang' | 'Cicilan' }) => {
  if (status === 'Lunas') return <div className="flex items-center gap-2 w-fit px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Lunas</div>;
  if (status === 'Cicilan') return <div className="flex items-center gap-2 w-fit px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-900/30 text-amber-600"><div className="w-1.5 h-1.5 rounded-full bg-amber-500" />Cicilan</div>;
  return <div className="flex items-center gap-2 w-fit px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-rose-100 dark:bg-rose-900/30 text-rose-600"><div className="w-1.5 h-1.5 rounded-full bg-rose-500" />Hutang</div>;
};

const StatCard = ({ stat }: { stat: { title: string; value: string; icon: any; trend: string; color: 'emerald' | 'rose' | 'amber' | 'orange' } }) => {
  const colorMap = {
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400',
    rose: 'bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400',
    orange: 'bg-orange-50 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400',
  } as const;

  return (
    <div className="group bg-white dark:bg-[#0f172a] p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800/50 hover:border-emerald-500/50 transition-all shadow-sm hover:shadow-lg">
      <div className="flex justify-between items-start mb-6">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all shadow-sm ${colorMap[stat.color]}`}><stat.icon size={22} /></div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black ${stat.trend.includes('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{stat.trend}</div>
      </div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.title}</p>
      <h4 className="text-xl font-black tracking-tight group-hover:text-emerald-600 transition-colors">{stat.value}</h4>
    </div>
  );
};

const NotificationItem = ({ icon, title, desc, time }: { icon: ReactNode; title: string; desc: string; time: string }) => (
  <div className="group flex gap-4 p-4 rounded-[1.5rem] hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-800 cursor-pointer">
    <div className="shrink-0 mt-1 p-2 bg-slate-50 dark:bg-slate-900 rounded-xl group-hover:bg-white dark:group-hover:bg-slate-800 shadow-sm transition-colors">{icon}</div>
    <div className="flex-grow">
      <div className="flex justify-between items-center mb-1"><p className="text-sm font-black text-slate-800 dark:text-slate-100 leading-none">{title}</p><span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{time}</span></div>
      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium line-clamp-2">{desc}</p>
    </div>
  </div>
);

const NavItem = ({ icon, label, active = false }: { icon: ReactNode; label: string; active?: boolean }) => (
  <button className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group ${active ? 'bg-emerald-600 text-white font-bold shadow-xl shadow-emerald-500/20' : 'text-slate-500 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:text-emerald-600 dark:hover:text-emerald-400'}`}>
    <div className="flex items-center gap-4"><span className={`${active ? 'text-white' : 'text-slate-400 group-hover:text-emerald-500'} transition-colors`}>{icon}</span><span className="text-sm tracking-tight">{label}</span></div>
    {active && <div className="w-1.5 h-1.5 bg-white rounded-full shadow-lg" />}
  </button>
);
