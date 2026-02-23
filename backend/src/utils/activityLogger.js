const { LogAktivitas } = require('../models');

const logActivity = async ({ userId, aksi, tabel, recordId, detail, ip }) => {
  await LogAktivitas.create({
    user_id: userId,
    aksi,
    tabel,
    record_id: recordId,
    detail: detail ? JSON.stringify(detail) : null,
    ip_address: ip,
  });
};

module.exports = { logActivity };
