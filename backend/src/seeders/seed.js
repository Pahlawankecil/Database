require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, Pengaturan } = require('../models');

(async () => {
  await sequelize.sync({ force: true });

  const hashed = await bcrypt.hash('admin123', 10);
  await User.create({ username: 'admin', password: hashed, nama_lengkap: 'Administrator', role: 'admin', is_active: true });

  const defaults = [
    ['perusahaan_nama', 'Toko Makanan Ringan', 'text'],
    ['perusahaan_alamat', '', 'text'],
    ['perusahaan_telepon', '', 'text'],
    ['perusahaan_logo', '', 'text'],
    ['backup_email', '', 'text'],
    ['backup_jadwal', '0 0 * * *', 'text'],
    ['batas_maksimal_hutang', '1000000', 'number'],
    ['printer_thermal', '{}', 'json'],
  ];

  await Pengaturan.bulkCreate(defaults.map(([key, value, tipe]) => ({ key, value, tipe })));

  console.log('Seeder selesai. admin/admin123 siap dipakai.');
  process.exit(0);
})();
