const { z } = require('zod');

const loginSchema = z.object({ username: z.string().min(3), password: z.string().min(6) });
const pelangganSchema = z.object({ nama: z.string().min(2), alamat: z.string().optional(), telepon: z.string().optional(), keterangan: z.string().optional() });
const kategoriSchema = z.object({ nama_kategori: z.string().min(2), deskripsi: z.string().optional() });
const barangSchema = z.object({
  nama_barang: z.string().min(2),
  kategori_id: z.number().int().positive(),
  harga: z.number().nonnegative(),
  satuan: z.enum(['pcs', 'pack', 'gr']),
  isi_per_pack: z.number().int().positive().optional(),
  stok: z.number().int().nonnegative(),
  stok_minimum: z.number().int().nonnegative(),
  keterangan: z.string().optional(),
});

const notaItemSchema = z.object({ barang_id: z.number().int().positive(), jumlah: z.number().int().positive(), keterangan: z.string().optional() });
const notaKontanSchema = z.object({ pelanggan_id: z.number().int().positive().optional(), nama_pelanggan_manual: z.string().optional(), uang_bayar: z.number().nonnegative(), items: z.array(notaItemSchema).min(1), keterangan: z.string().optional() });
const notaHutangSchema = z.object({ pelanggan_id: z.number().int().positive(), uang_dp: z.number().nonnegative().default(0), items: z.array(notaItemSchema).min(1), keterangan: z.string().optional() });
const bayarHutangSchema = z.object({ tanggal_bayar: z.string().datetime().optional(), jumlah_bayar: z.number().positive(), metode_bayar: z.enum(['tunai', 'transfer']), keterangan: z.string().optional() });

module.exports = { loginSchema, pelangganSchema, kategoriSchema, barangSchema, notaKontanSchema, notaHutangSchema, bayarHutangSchema };
