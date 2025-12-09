import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { readFileSync } from 'fs';
import { join } from 'path';


const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });


const productsData = JSON.parse(
  readFileSync(join(process.cwd(), 'data', 'products.json'), 'utf-8')
);

async function main() {
  console.log('🌱 Rozpoczynam zasilanie bazy danych...');


  const categoryMap: { [key: string]: string } = {
    'procesor': 'Procesory',
    'karta graficzna': 'Karty graficzne',
    'pamięć ram': 'Pamięć RAM',
    'dysk': 'Dyski'
  };


  console.log('📂 Tworzenie kategorii...');
  const categories = await Promise.all(
    Object.values(categoryMap).map(async (name) => {
      return prisma.category.upsert({
        where: { name },
        update: {},
        create: { name }
      });
    })
  );
  console.log(`✅ Utworzono ${categories.length} kategorii`);


  console.log('📦 Tworzenie produktów...');
  let productCount = 0;
  
  for (const product of productsData) {
    const categoryName = categoryMap[product.type];
    const category = categories.find(c => c.name === categoryName);
    
    if (!category) {
      console.warn(`⚠️  Nie znaleziono kategorii dla typu: ${product.type}`);
      continue;
    }

    await prisma.product.upsert({
      where: { code: product.code },
      update: {
        name: product.name,
        description: product.description,
        price: product.price,
        amount: product.amount,
        inStock: product.amount > 0,
        image: product.image,
        categoryId: category.id,
      },
      create: {
        code: product.code,
        name: product.name,
        description: product.description,
        price: product.price,
        amount: product.amount,
        inStock: product.amount > 0,
        image: product.image,
        categoryId: category.id,
        createdAt: new Date(product.date),
      }
    });
    
    productCount++;
    if (productCount % 20 === 0) {
      console.log(`   Dodano ${productCount} produktów...`);
    }
  }
  
  console.log(`✅ Utworzono ${productCount} produktów`);

  // Tworzenie przykładowych użytkowników
  console.log('\n👥 Tworzenie użytkowników...');
  const user1 = await prisma.user.upsert({
    where: { email: 'jan.kowalski@example.com' },
    update: {},
    create: {
      email: 'jan.kowalski@example.com',
      name: 'Jan Kowalski',
    } as any, // tymczasowe rzutowanie do czasu ponownego wygenerowania klienta Prisma
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'anna.nowak@example.com' },
    update: {},
    create: {
      email: 'anna.nowak@example.com',
      name: 'Anna Nowak',
    } as any,
  });

  console.log(`✅ Utworzono 2 użytkowników`);


  const allProducts = await prisma.product.findMany({ take: 10 });


  console.log('\n🛒 Tworzenie przykładowego koszyka...');
  
 
  await prisma.cart.deleteMany({
    where: { userId: user1.id }
  });
  
  const cart = await prisma.cart.create({
    data: {
      userId: user1.id,
      items: {
        create: [
          {
            productId: allProducts[0].id,
            quantity: 2,
          },
          {
            productId: allProducts[1].id,
            quantity: 1,
          },
          {
            productId: allProducts[2].id,
            quantity: 3,
          },
        ]
      }
    },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  });

  console.log(`✅ Utworzono koszyk z ${cart.items.length} produktami dla użytkownika ${user1.name}`);


  console.log('\n📦 Tworzenie przykładowych zamówień...');
  

  await prisma.order.deleteMany({});
  
  // Zamówienie 1 - DELIVERED
  const order1 = await prisma.order.create({
    data: {
      orderNumber: `ORD-${Date.now()}-001`,
      userId: user1.id,
      status: 'DELIVERED',
      total: allProducts[3].price + allProducts[4].price * 2,
      items: {
        create: [
          {
            productId: allProducts[3].id,
            quantity: 1,
            priceAtOrder: allProducts[3].price,
            productCode: allProducts[3].code,
            productName: allProducts[3].name,
          },
          {
            productId: allProducts[4].id,
            quantity: 2,
            priceAtOrder: allProducts[4].price,
            productCode: allProducts[4].code,
            productName: allProducts[4].name,
          },
        ]
      }
    }
  });

  // Zamówienie 2 - SHIPPED
  const order2 = await prisma.order.create({
    data: {
      orderNumber: `ORD-${Date.now()}-002`,
      userId: user2.id,
      status: 'SHIPPED',
      total: allProducts[5].price * 3,
      items: {
        create: [
          {
            productId: allProducts[5].id,
            quantity: 3,
            priceAtOrder: allProducts[5].price,
            productCode: allProducts[5].code,
            productName: allProducts[5].name,
          },
        ]
      }
    }
  });

  // Zamówienie 3 - PROCESSING
  const order3 = await prisma.order.create({
    data: {
      orderNumber: `ORD-${Date.now()}-003`,
      userId: user1.id,
      status: 'PROCESSING',
      total: allProducts[6].price + allProducts[7].price + allProducts[8].price,
      items: {
        create: [
          {
            productId: allProducts[6].id,
            quantity: 1,
            priceAtOrder: allProducts[6].price,
            productCode: allProducts[6].code,
            productName: allProducts[6].name,
          },
          {
            productId: allProducts[7].id,
            quantity: 1,
            priceAtOrder: allProducts[7].price,
            productCode: allProducts[7].code,
            productName: allProducts[7].name,
          },
          {
            productId: allProducts[8].id,
            quantity: 1,
            priceAtOrder: allProducts[8].price,
            productCode: allProducts[8].code,
            productName: allProducts[8].name,
          },
        ]
      }
    }
  });

  // Zamówienie 4 - PENDING
  const order4 = await prisma.order.create({
    data: {
      orderNumber: `ORD-${Date.now()}-004`,
      userId: user2.id,
      status: 'PENDING',
      total: allProducts[9].price * 2,
      items: {
        create: [
          {
            productId: allProducts[9].id,
            quantity: 2,
            priceAtOrder: allProducts[9].price,
            productCode: allProducts[9].code,
            productName: allProducts[9].name,
          },
        ]
      }
    }
  });

  console.log(`✅ Utworzono 4 zamówienia:`);
  console.log(`   - ${order1.orderNumber}: ${order1.status} (${order1.total} zł)`);
  console.log(`   - ${order2.orderNumber}: ${order2.status} (${order2.total} zł)`);
  console.log(`   - ${order3.orderNumber}: ${order3.status} (${order3.total} zł)`);
  console.log(`   - ${order4.orderNumber}: ${order4.status} (${order4.total} zł)`);

  // Statystyki
  const stats = await Promise.all(
    categories.map(async (category) => {
      const count = await prisma.product.count({
        where: { categoryId: category.id }
      });
      return { category: category.name, count };
    })
  );

  console.log('\n📊 Statystyki produktów według kategorii:');
  stats.forEach(({ category, count }) => {
    console.log(`   ${category}: ${count} produktów`);
  });

  console.log('\n🎉 Zasilanie bazy danych zakończone sukcesem!');
}

main()
  .catch((e) => {
    console.error('❌ Błąd podczas zasilania bazy:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
