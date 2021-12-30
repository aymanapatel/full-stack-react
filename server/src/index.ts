import "reflect-metadata";
import "dotenv-safe/config";
import { MikroORM } from "@mikro-orm/core";

import { Post } from "./entities/Post";
import config from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";

import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { GetResolver } from "./resolvers/get";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";

const main = async () => {
  console.log("-----------------", process.env.DATABASE_URL);
  const orm = await MikroORM.init(config);

  orm.getMigrator().up();

  // const post = orm.em.create(Post, { title: "Ayman" });
  // console.log("------- ORM Insert Start-----------");
  // await orm.em.persistAndFlush(post);
  //   console.log("------- Native Insert-----------");
  //   await orm.em.nativeInsert(Post, { title: "Ayman" });
  console.log("------- Insert done-----------");
  const posts = await orm.em.find(Post, {});
  console.log(posts);
  console.log("------- Select done-----------");

  const app = express();

  console.log("-------GraphQL setup start-----------");

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [GetResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: () => ({ em: orm.em }), // TODO: Add comment
    // The GraphQL Playground plugin is not installed by default.
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground({
        // options
      }),
    ],
  });

  // Ben's tutorial does not have this line. Without below line, get this error
  //  Error: You must `await server.start()` before calling `server.applyMiddleware()`
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
  app.listen(4000, () => {
    console.log("Server started @ 4000");
  });
  console.log("-------GraphQL setup done-----------");
};

main().catch((err) => {
  console.log(err);
});
