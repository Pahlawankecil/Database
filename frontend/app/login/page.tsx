'use client';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({ username: '', password: '' });
  const [dark, setDark] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { data } = await api.post('/auth/login', form);
    setAuth(data.token, data.user);
    router.push('/dashboard');
  };

  return (
    <main className={dark ? 'dark min-h-screen' : 'min-h-screen'}>
      <section className="flex min-h-screen items-center justify-center p-4">
        <form className="card w-full max-w-sm space-y-4" onSubmit={onSubmit}>
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Login Kasir/Admin</h1>
            <button type="button" className="btn" onClick={() => setDark(!dark)}>{dark ? '☀️' : '🌙'}</button>
          </div>
          <input className="input" placeholder="Username" onChange={(e) => setForm({ ...form, username: e.target.value })} />
          <input className="input" type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button className="btn-primary w-full" type="submit">Masuk</button>
        </form>
      </section>
    </main>
  );
}
