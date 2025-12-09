'use client';

import { useEffect, useState } from 'react';

export default function Footer() {
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const now = new Date();
    setDateStr(now.toLocaleDateString());
  }, []);

  return (
    <footer className="bg-slate-900 text-white border-t border-white/5 py-4">
      <div className="max-w-[1100px] mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
        <div>Autor: Grzegorz Kasprzak</div>
        <div>Data: {dateStr}</div>
        <div>
          <a href="https://www.pk.edu.pl" target="_blank" rel="noreferrer" className="text-white hover:text-blue-300">
            Politechnika Krakowska
          </a>
        </div>
      </div>
    </footer>
  );
}
