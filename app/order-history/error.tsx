'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function OrderHistoryError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // log error to console for dev
    console.error('OrderHistory error:', error);
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-4">Wystąpił błąd na stronie historii zakupów</h1>
      <p className="mb-6 text-gray-600">{error?.message ?? 'Nieznany błąd'}</p>
      <div className="flex gap-4">
        <button 
          onClick={() => reset()} 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Spróbuj ponownie
        </button>
        <Link href="/" className="px-4 py-2 text-blue-600 hover:underline">
          Przejdź do strony głównej
        </Link>
      </div>
    </main>
  );
}
