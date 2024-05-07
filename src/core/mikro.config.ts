import { defineConfig } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';

export default defineConfig({
  clientUrl: process.env.DATABASE_URI,
  entities: ['dist/entities'],
  entitiesTs: ['src/entities'],
  extensions: [Migrator],
  migrations: {
    tableName: 'migration',
    snapshot: false,
    pathTs: './migrations',
  },
});
