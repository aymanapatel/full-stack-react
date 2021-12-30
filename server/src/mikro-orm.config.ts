import { Options } from "@mikro-orm/core";
import path from "path";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { User } from "./entities/User";

const config: Options = {
  migrations: {
    path: path.join(__dirname, "./migrations"), // Absolute path
    pattern: /^[\w-]+\d+\.[tj]s$/, // regex pattern for the migration files
    disableForeignKeys: false,
    dropTables: true,
  },
  entities: [Post, User],
  dbName: "postgres",
  type: "postgresql",
  debug: !__prod__,
  clientUrl: process.env.DATABASE_URL,
};

export default config;
