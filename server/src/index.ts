import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import config from "./mikro-orm.config";

const main = async () => {
  const orm = await MikroORM.init(config);

  const post = orm.em.create(Post, { title: "Ayman" });
  await orm.em.persistAndFlush(post);
  await orm.em.nativeInsert(Post, { title: "Ayman" });
};

main().catch((err) => {
  console.log(err);
});
