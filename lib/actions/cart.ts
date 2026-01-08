'use server';

import prisma from '@/lib/prisma';

type TransactionClient = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

/**
 * Pobiera koszyk użytkownika wraz z wszystkimi powiązanymi danymi
 * @param userId - ID użytkownika
 * @returns Obiekt koszyka z pozycjami, produktami i kategoriami lub null
 */
export async function getCartWithItems(userId: string) {
  if (!userId) {
    return null;
  }

  const cart = await prisma.cart.findUnique({
    where: {
      userId: userId,
    },
    include: {
      items: {
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc', // najnowsze na górze
        },
      },
    },
  });

  return cart;
}

export type CartWithItems = Awaited<ReturnType<typeof getCartWithItems>>;
export type CartItem = NonNullable<CartWithItems>['items'][number];

/**
 * Oblicza całkowitą wartość koszyka użytkownika
 * @param userId - ID użytkownika
 * @returns Całkowita wartość koszyka
 */
export async function getCartTotal(userId: string): Promise<number> {
  if (!userId) {
    return 0;
  }

  const cart = await getCartWithItems(userId);

  // Jeśli koszyk nie istnieje, zwróć 0
  if (!cart) {
    return 0;
  }

  // Oblicz sumę używając reduce
  const total = cart.items.reduce<number>((sum: number, item: { product: { price: number | string }; quantity: number }) => {
    const price = Number(item.product.price);
    const quantity = item.quantity;
    return sum + (price * quantity);
  }, 0);

  return total;
}

/**
 * Pobiera listę użytkowników wraz z informacją o ich koszykach
 */
export type UserWithCartSummary = {
  id: string;
  email: string | null;
  name: string | null;
  cartItemCount: number;
  cartQuantity: number;
};

export async function getAllUsersWithCarts(): Promise<UserWithCartSummary[]> {
  const users = await prisma.user.findMany({
    include: {
      cart: {
        include: {
          items: {
            select: {
              id: true,
              quantity: true,
            },
          },
        },
      },
    },
    orderBy: {
      email: "asc",
    },
  });

  return users.map((user: { id: string; email: string | null; name: string | null; cart: { items: { quantity: number }[] } | null }) => {
    const items = user.cart?.items ?? [];
    const totalQuantity = items.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0);
    return {
      id: user.id,
      email: user.email ?? null,
      name: user.name ?? null,
      cartItemCount: items.length,
      cartQuantity: totalQuantity,
    };
  });
}

/**
 * Przenosi zawartość koszyka pomiędzy użytkownikami
 */
export async function transferCart(fromUserId: string, toUserId: string) {
  if (!fromUserId || !toUserId) {
    throw new Error("Wybierz użytkowników do przeniesienia koszyka");
  }

  if (fromUserId === toUserId) {
    throw new Error("Nie można przenieść koszyka do tego samego użytkownika");
  }

  let transferredQuantity = 0;

  await prisma.$transaction(async (tx: TransactionClient) => {
    const fromCart = await tx.cart.findUnique({
      where: { userId: fromUserId },
      include: { items: true },
    });

    if (!fromCart || fromCart.items.length === 0) {
      return;
    }

    let toCart = await tx.cart.findUnique({
      where: { userId: toUserId },
    });

    if (!toCart) {
      toCart = await tx.cart.create({
        data: {
          userId: toUserId,
        },
      });
    }

    for (const item of fromCart.items) {
      await tx.cartItem.upsert({
        where: {
          cartId_productId: {
            cartId: toCart.id,
            productId: item.productId,
          },
        },
        update: {
          quantity: {
            increment: item.quantity,
          },
        },
        create: {
          cartId: toCart.id,
          productId: item.productId,
          quantity: item.quantity,
        },
      });

      transferredQuantity += item.quantity;
    }

    await tx.cartItem.deleteMany({
      where: {
        cartId: fromCart.id,
      },
    });
  });

  return {
    transferredQuantity,
  };
}
