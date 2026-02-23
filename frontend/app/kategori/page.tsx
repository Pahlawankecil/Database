'use client';
import Navbar from '@/components/Navbar';
import { api } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export default function KategoriPage() {
  const qc = useQueryClient();
  const [nama_kategori, setNamaKategori] = useState('');
  const { data } = useQuery({ queryKey: ['kategori'], queryFn: async () => (await api.get('/kategori')).data });
  const create = useMutation({ mutationFn: async () => api.post('/kategori', { nama_kategori }), onSuccess: () => qc.invalidateQueries({ queryKey: ['kategori'] }) });

  return (
    <main>
      <Navbar />
      <div className="space-y-3 p-4">
        <div className="card flex gap-2"><input className="input" value={nama_kategori} onChange={(e) => setNamaKategori(e.target.value)} /><button className="btn-primary" onClick={() => create.mutate()}>Tambah Kategori</button></div>
        {(data || []).map((item: any) => <div key={item.id} className="card">{item.nama_kategori}</div>)}
      </div>
    </main>
  );
}
