import { PrismaClient, Prisma } from '@prisma/client'; 
import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import * as dotenv from 'dotenv';
import * as path from 'path';
import ws from 'ws';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error('❌ Критическая ошибка сидинга: Переменная DATABASE_URL не найдена в памяти процесса!');
}

(neonConfig as any).webSocketConstructor = ws;

const adapter = new PrismaNeon({ connectionString: dbUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Старт наполнения базы данных FlexDesk...');

  try {
    await prisma.booking.deleteMany();
    await prisma.desk.deleteMany();
    console.log('🧹 Старые данные успешно удалены из таблиц.');
  } catch (error: unknown) { 

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2021') {
      console.log('ℹ️ Таблицы еще не созданы в БД, пропускаем шаг очистки...');
    } else if (error instanceof Error) {
      console.warn('⚠️ Предупреждение при очистке таблиц:', error.message);
    } else {
      console.warn('⚠️ Неизвестное предупреждение при очистке таблиц:', error);
    }
  }

  await prisma.desk.create({
    data: {
      id: '11111111-1111-4111-8111-111111111111', 
      name: 'Стол #1 (Около окна)',
      area: 'Open Space',
      pricePerHourCents: 25000, 
    },
  });

  await prisma.desk.create({
    data: {
      id: '22222222-2222-4222-8222-222222222222',
      name: 'Стол #2 (Тихий угол)',
      area: 'Quiet Zone',
      pricePerHourCents: 35000, 
    },
  });

  await prisma.desk.create({
    data: {
      id: '33333333-3333-4333-8333-333333333333',
      name: 'Переговорка "Альфа"',
      area: 'Meeting Room',
      pricePerHourCents: 120000, 
    },
  });

  console.log(`✅ База данных успешно засиджена. Создано столов: 3`);
}

main()
  .catch((e) => {
    console.error('❌ Ошибка сидинга:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });