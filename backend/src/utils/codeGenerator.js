const { Op } = require('sequelize');

const dateToken = () => {
  const d = new Date();
  const yy = String(d.getFullYear()).slice(-2);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yy}${mm}${dd}`;
};

const nextCode = async (Model, field, prefix) => {
  const token = dateToken();
  const start = `${prefix}/${token}/`;
  const latest = await Model.findOne({ where: { [field]: { [Op.like]: `${start}%` } }, order: [[field, 'DESC']] });
  const num = latest ? Number(String(latest[field]).split('/').pop()) + 1 : 1;
  return `${start}${String(num).padStart(3, '0')}`;
};

module.exports = { nextCode };
