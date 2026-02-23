'use client';
import Navbar from '@/components/Navbar';
import { api } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export default function PelangganPage() {
  const qc = useQueryClient();
  const [nama, setNama] = useState('');
  const [q, setQ] = useState('');
  const { data } = useQuery({ queryKey: ['pelanggan', q], queryFn: async () => (await api.get(`/pelanggan?q=${q}`)).data });
  const create = useMutation({
    mutationFn: async () => api.post('/pelanggan', { nama }),
    onSuccess: () => { setNama(''); qc.invalidateQueries({ queryKey: ['pelanggan'] }); },
  });

  return (
    <main>
      <Navbar />
      <div className="space-y-3 p-4">
        <div className="card space-y-2">
          <h1 className="font-semibold">Manajemen Pelanggan</h1>
          <input className="input" placeholder="Cari pelanggan" value={q} onChange={(e) => setQ(e.target.value)} />
          <div className="flex gap-2">
            <input className="input" placeholder="Nama pelanggan" value={nama} onChange={(e) => setNama(e.target.value)} />
            <button className="btn-primary" onClick={() => create.mutate()}>Tambah</button>
          </div>
        </div>
        {(data || []).map((item: any) => <div key={item.id} className="card text-sm">{item.kode_pelanggan} - {item.nama}</div>)}
      </div>
    </main>
  );
}
