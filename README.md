# Aplikasi Manajemen Penjualan Makanan Ringan

Monorepo aplikasi web untuk manajemen penjualan dengan nota kontan & hutang.

## Stack
- Backend: Node.js + Express + Sequelize + SQLite + JWT
- Frontend: Next.js 14 App Router + TailwindCSS + Zustand + React Query + Recharts
- Realtime: Socket.io

## Menjalankan Lokal
1. Install dependency:
   ```bash
   npm run install:all
   ```
2. Setup env backend:
   ```bash
   cp backend/.env.example backend/.env
   ```
3. Seed database default (admin/admin123):
   ```bash
   npm run seed
   ```
4. Jalankan backend:
   ```bash
   npm run dev:backend
   ```
5. Jalankan frontend:
   ```bash
   npm run dev:frontend
   ```

## Endpoint inti
- `POST /api/auth/login`
- `GET /api/dashboard/summary`
- `CRUD /api/pelanggan`
- `CRUD /api/kategori`
- `CRUD /api/barang`
- `POST /api/nota/kontan`
- `POST /api/nota/hutang`
- `GET /api/nota/hutang/:id`
- `POST /api/nota/hutang/:id/bayar`

## Default User
- username: `admin`
- password: `admin123`

## Catatan
Implementasi fokus pada prioritas inti: autentikasi, dashboard dasar, manajemen pelanggan/barang/kategori, nota kontan, nota hutang + riwayat pembayaran.
