'use client';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function SalesChart({ data }: { data: any[] }) {
  return (
    <div className="card h-72">
      <h3 className="mb-3 font-semibold">Penjualan 7 Hari</h3>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <XAxis dataKey="tanggal" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="total" stroke="#0d9488" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
