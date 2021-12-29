import { Options } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";

const config: Options = {
  dbName: "full-stack-react",
  type: "postgresql",
  debug: !__prod__,
  entities: [Post],
};

export default config;
