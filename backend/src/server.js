require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const { sequelize } = require('./models');

const port = process.env.PORT || 4000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_ORIGIN || '*' },
});

io.on('connection', (socket) => {
  socket.on('nota:created', (payload) => io.emit('dashboard:update', payload));
});

(async () => {
  await sequelize.sync();
  server.listen(port, () => console.log(`API running on :${port}`));
})();
