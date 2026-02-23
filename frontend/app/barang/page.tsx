'use client';
import Navbar from '@/components/Navbar';
import { api } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export default function BarangPage() {
  const qc = useQueryClient();
  const [form, setForm] = useState({ nama_barang: '', kategori_id: 1, harga: 0, satuan: 'pcs', stok: 0, stok_minimum: 0 });
  const { data: list } = useQuery({ queryKey: ['barang'], queryFn: async () => (await api.get('/barang')).data });
  const { data: kategori } = useQuery({ queryKey: ['kategori'], queryFn: async () => (await api.get('/kategori')).data });
  const create = useMutation({ mutationFn: async () => api.post('/barang', form), onSuccess: () => qc.invalidateQueries({ queryKey: ['barang'] }) });

  return (
    <main>
      <Navbar />
      <div className="space-y-3 p-4">
        <div className="card space-y-2">
          <h1 className="font-semibold">Tambah Barang</h1>
          <input className="input" placeholder="Nama" onChange={(e) => setForm({ ...form, nama_barang: e.target.value })} />
          <select className="input" onChange={(e) => setForm({ ...form, kategori_id: Number(e.target.value) })}>{(kategori || []).map((k: any) => <option key={k.id} value={k.id}>{k.nama_kategori}</option>)}</select>
          <button className="btn-primary" onClick={() => create.mutate()}>Simpan</button>
        </div>
        {(list || []).map((b: any) => <div key={b.id} className="card">{b.nama_barang} - stok {b.stok}</div>)}
      </div>
    </main>
  );
}
