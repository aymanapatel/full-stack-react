import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import config from "./mikro-orm.config";

const main = async () => {
  const orm = await MikroORM.init(config);

  orm.getMigrator().up();

  const post = orm.em.create(Post, { title: "Ayman" });
  console.log("------- ORM Insert-----------");
  await orm.em.persistAndFlush(post);
  //   console.log("------- Native Insert-----------");
  //   await orm.em.nativeInsert(Post, { title: "Ayman" });
  const posts = await orm.em.find(Post, {});
  console.log(posts);
};

main().catch((err) => {
  console.log(err);
});
