'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function FabQuickAction() {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-5 right-5">
      {open && (
        <div className="mb-2 rounded-lg bg-white p-2 shadow dark:bg-slate-800">
          <Link href="#" className="block p-2 text-sm">Nota Kontan</Link>
          <Link href="#" className="block p-2 text-sm">Nota Hutang</Link>
        </div>
      )}
      <button className="h-12 w-12 rounded-full bg-teal-600 text-2xl text-white" onClick={() => setOpen(!open)}>+</button>
    </div>
  );
}
