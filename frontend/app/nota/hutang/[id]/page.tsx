'use client';
import Navbar from '@/components/Navbar';
import { api } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function DetailHutangPage() {
  const { id } = useParams<{ id: string }>();
  const qc = useQueryClient();
  const [jumlah_bayar, setJumlah] = useState(0);
  const { data } = useQuery({ queryKey: ['hutang', id], queryFn: async () => (await api.get(`/nota/hutang/${id}`)).data });
  const bayar = useMutation({ mutationFn: async () => api.post(`/nota/hutang/${id}/bayar`, { jumlah_bayar, metode_bayar: 'tunai' }), onSuccess: () => qc.invalidateQueries({ queryKey: ['hutang', id] }) });

  return (
    <main>
      <Navbar />
      <div className="space-y-3 p-4">
        <div className="card">Nota: {data?.nomor_nota} | Status: {data?.status_hutang}</div>
        <div className="card">Sisa: Rp {Number(data?.sisa_hutang || 0).toLocaleString('id-ID')}</div>
        <div className="card space-y-2">
          <h2 className="font-semibold">Riwayat Pembayaran</h2>
          {(data?.riwayat || []).map((r: any) => <div key={r.id} className="text-sm">{new Date(r.tanggal_bayar).toLocaleDateString('id-ID')} - Rp {Number(r.jumlah_bayar).toLocaleString('id-ID')} (sisa {Number(r.sisa_sesudah).toLocaleString('id-ID')})</div>)}
          <input className="input" type="number" value={jumlah_bayar} onChange={(e) => setJumlah(Number(e.target.value))} />
          <button className="btn-primary" onClick={() => bayar.mutate()}>Tambah Pembayaran</button>
        </div>
      </div>
    </main>
  );
}
