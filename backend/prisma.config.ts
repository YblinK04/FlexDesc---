import { defineConfig } from '@prisma/config';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const dbUrl = process.env.DATABASE_URL;

export default defineConfig({
  // 🟩 ДОБАВЛЯЕМ СЕКЦИЮ СИДИНГА ДЛЯ PRISMA 7+
  migrations: {
    // Если используете ts-node, замените на: 'ts-node ./prisma/seed.ts'
    seed: 'npx tsx ./prisma/seed.ts', 
  },
  datasource: {
    url: dbUrl,
  },
});