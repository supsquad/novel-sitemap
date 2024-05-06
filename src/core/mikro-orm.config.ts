import { defineConfig } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';

export const config = {
  clientUrl: process.env.DATABASE_URI,
  entities: ['src/entities'],
};

export default defineConfig({
  extensions: [Migrator],
  migrations: {
    tableName: 'migration',
    snapshot: false,
  },
  debug: true,
  ...config,
});
