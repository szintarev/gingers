import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Migration stub — run `payload migrate:create` to regenerate with full SQL
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Migration stub — run `payload migrate:create` to regenerate with full SQL
}
