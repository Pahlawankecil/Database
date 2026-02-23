'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Navbar from '@/components/Navbar';
import SalesChart from '@/components/SalesChart';
import FabQuickAction from '@/components/FabQuickAction';
import { useAuthStore } from '@/store/auth';

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { data } = useQuery({ queryKey: ['summary'], queryFn: async () => (await api.get('/dashboard/summary')).data });
  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <main>
      <Navbar />
      <div className="space-y-4 p-4">
        <div className="card"><p>{today}</p><p>25 Sya'ban 1446 H (perkiraan)</p></div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {user?.role === 'admin' && <div className="card">Penjualan Hari Ini<br />Rp {Number(data?.totalPenjualanHariIni || 0).toLocaleString('id-ID')}</div>}
          <div className="card">Total Hutang<br />Rp {Number(data?.totalHutangBelumLunas || 0).toLocaleString('id-ID')}</div>
          <div className="card">Pelanggan Aktif<br />{data?.jumlahPelangganAktif || 0}</div>
          <div className="card">Jumlah Barang<br />{data?.jumlahBarang || 0}</div>
        </div>
        <SalesChart data={data?.sales || []} />
        <div className="card">
          <h3 className="mb-2 font-semibold">Pelanggan Berhutang</h3>
          <div className="space-y-2">
            {(data?.pelangganHutang || []).map((p: any) => (
              <div key={p.id} className="rounded border p-2 text-sm dark:border-slate-700">{p.nama} - Rp {Number(p.total_hutang).toLocaleString('id-ID')}</div>
            ))}
          </div>
        </div>
      </div>
      <FabQuickAction />
    </main>
  );
}
