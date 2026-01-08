import {
  getCartWithItems,
  getCartTotal,
  getAllUsersWithCarts,
  transferCart,
} from '@/lib/actions/cart';
import { SignIn, SignOut } from '@/app/components/auth-components';
import { auth } from '@/lib/auth';
import Image from 'next/image';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { UserWithCartSummary } from '@/lib/actions/cart';

type BasketPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default async function Basket({ searchParams }: BasketPageProps) {
  const session = await auth();
  const userId = session?.user?.id ?? '';

  const [cart, total, usersRaw] = await Promise.all([
    userId ? getCartWithItems(userId) : Promise.resolve(null),
    userId ? getCartTotal(userId) : Promise.resolve(0),
    getAllUsersWithCarts(),
  ]);

  const users: UserWithCartSummary[] = usersRaw;

  const transferStatus = typeof searchParams?.status === 'string' ? searchParams.status : undefined;

  const defaultFromUserId =
    users.find((user) => user.cartItemCount > 0 && user.id !== userId)?.id ??
    users.find((user) => user.cartItemCount > 0)?.id ??
    '';
  const defaultToUserId = userId || users.find((user) => user.id !== defaultFromUserId)?.id || '';

  async function transferCartAction(formData: FormData) {
    'use server';

    const session = await auth();
    const currentUserId = session?.user?.id;

    if (!currentUserId) {
      redirect('/basket?status=not-authenticated');
    }

    const fromUserId = String(formData.get('fromUserId') ?? '');
    const toUserId = String(formData.get('toUserId') ?? '');

    if (!fromUserId || !toUserId) {
      redirect('/basket?status=missing-users');
    }

    if (fromUserId === toUserId) {
      redirect('/basket?status=same-user');
    }

    try {
      await transferCart(fromUserId, toUserId);
      revalidatePath('/basket');
      redirect('/basket?status=success');
    } catch (error) {
      console.error('transferCartAction error:', error);
      redirect('/basket?status=error');
    }
  }

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Koszyk zakupowy</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {userId ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-500">Zalogowany użytkownik</p>
                <p className="text-lg font-semibold text-gray-900">
                  {session?.user?.email || session?.user?.name || 'Użytkownik'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/order-history"
                  className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
                >
                  Historia zamówień
                </Link>
                <SignOut
                  redirectTo="/"
                  buttonClassName="inline-flex items-center rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
                  formClassName="inline-block"
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  Zaloguj się, aby zobaczyć swój koszyk
                </p>
                <p className="text-sm text-gray-600">
                  Po zalogowaniu przypisz do siebie istniejący koszyk lub dodaj nowe produkty.
                </p>
              </div>
              <SignIn
                provider="github"
                redirectTo="/basket"
                buttonClassName="inline-flex items-center rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
              >
                Zaloguj się przez GitHub
              </SignIn>
            </div>
          )}
        </div>

        {transferStatus && (
          <div
            className={`mb-6 rounded-lg border p-4 text-sm font-medium ${
              transferStatus === 'success'
                ? 'border-green-200 bg-green-50 text-green-700'
                : transferStatus === 'same-user' || transferStatus === 'missing-users'
                ? 'border-yellow-200 bg-yellow-50 text-yellow-700'
                : 'border-red-200 bg-red-50 text-red-700'
            }`}
          >
            {transferStatus === 'success' && 'Koszyk został pomyślnie przeniesiony.'}
            {transferStatus === 'same-user' && 'Nie można przenieść koszyka do tego samego użytkownika.'}
            {transferStatus === 'missing-users' && 'Wybierz użytkowników przed przeniesieniem koszyka.'}
            {transferStatus === 'not-authenticated' && 'Zaloguj się, aby móc przenosić koszyki.'}
            {transferStatus === 'error' && 'Nie udało się przenieść koszyka. Spróbuj ponownie.'}
          </div>
        )}

        {!cart || cart.items.length === 0 ? (
          // Pusty koszyk
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="mb-4">
              <svg
                className="mx-auto h-24 w-24 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              {userId ? 'Twój koszyk jest pusty' : 'Zaloguj się, aby zobaczyć koszyk'}
            </h2>
            <p className="text-gray-500 mb-6">
              {userId
                ? 'Dodaj produkty do koszyka, aby kontynuować zakupy'
                : 'Po zalogowaniu będziesz mógł zobaczyć i zarządzać swoim koszykiem'}
            </p>
            <Link
              href="/product-list"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Przejdź do sklepu
            </Link>
          </div>
        ) : (
          // Koszyk z produktami
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista produktów */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-md p-6 flex gap-6"
                >
                  {/* Obrazek produktu */}
                  <div className="flex-shrink-0">
                    <div className="relative w-24 h-24 bg-gray-100 rounded">
                      <Image
                        src="/img/produkt.jpg"
                        alt={item.product.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  </div>

                  {/* Informacje o produkcie */}
                  <div className="flex-grow">
                    <Link
                      href={`/product-list/${item.productId}`}
                      className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-gray-600 mt-1">
                      {item.product.category.name}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Kod: {item.product.code}
                    </p>
                  </div>

                  {/* Ilość i cena */}
                  <div className="flex flex-col items-end justify-between">
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {Number(item.product.price).toFixed(2)} zł
                      </p>
                      <p className="text-sm text-gray-600">
                        Ilość: {item.quantity} szt.
                      </p>
                    </div>
                    <div className="text-right mt-2">
                      <p className="text-sm text-gray-500">Wartość:</p>
                      <p className="text-xl font-bold text-blue-600">
                        {(Number(item.product.price) * item.quantity).toFixed(2)} zł
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Podsumowanie */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <h2 className="text-xl font-bold mb-4">Podsumowanie</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Liczba produktów:</span>
                    <span className="font-semibold">
                      {cart.items.reduce((sum, item) => sum + item.quantity, 0)} szt.
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Liczba pozycji:</span>
                    <span className="font-semibold">{cart.items.length}</span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Razem:</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {total.toFixed(2)} zł
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  className={`w-full py-3 rounded-lg font-semibold mb-3 transition-colors ${
                    !userId || !cart || cart.items.length === 0
                      ? 'bg-green-200 text-green-700 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                  disabled={!userId || !cart || cart.items.length === 0}
                >
                  Przejdź do kasy
                </button>
                
                <Link
                  href="/product-list"
                  className="block text-center text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Kontynuuj zakupy
                </Link>
              </div>
            </div>
          </div>
        )}

        <section className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Przenieś koszyk między użytkownikami</h2>
            <p className="text-sm text-gray-600 mb-6">
              Funkcja pozwala przenieść produkty pomiędzy istniejącymi kontami, np. z konta testowego na aktualnego użytkownika.
            </p>

            <form action={transferCartAction} className="space-y-4">
              <div>
                <label htmlFor="fromUserId" className="block text-sm font-medium text-gray-700 mb-1">
                  Przenieś koszyk od użytkownika
                </label>
                <select
                  id="fromUserId"
                  name="fromUserId"
                  defaultValue={defaultFromUserId}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Wybierz użytkownika</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {(user.email || user.name || 'Użytkownik bez e-maila')}
                      {` — ${user.cartQuantity} szt.`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="toUserId" className="block text-sm font-medium text-gray-700 mb-1">
                  Przenieś koszyk do użytkownika
                </label>
                <select
                  id="toUserId"
                  name="toUserId"
                  defaultValue={defaultToUserId}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Wybierz użytkownika</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {(user.email || user.name || 'Użytkownik bez e-maila')}
                      {` — ${user.cartQuantity} szt.`}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
              >
                Przenieś koszyk
              </button>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Użytkownicy i ich koszyki</h2>
            <ul className="space-y-3 text-sm text-gray-700">
              {users.length === 0 && <li>Brak użytkowników w systemie.</li>}
              {users.map((user) => (
                <li key={user.id} className="flex items-center justify-between rounded-md border border-gray-100 px-3 py-2">
                  <div>
                    <p className="font-medium text-gray-900">{user.email || user.name || 'Użytkownik bez e-maila'}</p>
                    <p className="text-xs text-gray-500">ID: {user.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{user.cartQuantity} szt.</p>
                    <p className="text-xs text-gray-500">{user.cartItemCount} pozycji</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}

