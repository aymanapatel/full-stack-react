import { Migration } from "@mikro-orm/migrations";

export class Migration20211229134142 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "post" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "title" text not null);'
    );

    // this.addSql('drop table if exists "auth"."audit_log_entries" cascade;');

    // this.addSql('drop table if exists "storage"."buckets" cascade;');

    // this.addSql('drop table if exists "auth"."identities" cascade;');

    // this.addSql('drop table if exists "auth"."instances" cascade;');

    // this.addSql('drop table if exists "storage"."migrations" cascade;');

    // this.addSql('drop table if exists "storage"."objects" cascade;');

    // this.addSql('drop table if exists "auth"."refresh_tokens" cascade;');

    // this.addSql('drop table if exists "realtime"."schema_migrations" cascade;');

    // this.addSql('drop table if exists "auth"."schema_migrations" cascade;');

    // this.addSql('drop table if exists "realtime"."subscription" cascade;');

    // this.addSql('drop table if exists "auth"."users" cascade;');
  }
}
