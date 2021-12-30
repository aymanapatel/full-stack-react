import "reflect-metadata";
import "dotenv-safe/config";
import { MikroORM } from "@mikro-orm/core";

// import { Post } from "./entities/Post";
import config from "./mikro-orm.config";
import express from "express";

import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

import session from "express-session";
import connectRedis from "connect-redis";
import Redis from "ioredis";

import { GetResolver } from "./resolvers/get";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { __prod__ } from "./constants";
import { MyContext } from "./types";

const main = async () => {
  console.log("-----------------", process.env.DATABASE_URL);
  const orm = await MikroORM.init(config);

  orm.getMigrator().up();

  console.log("------- Select done-----------");

  const app = express();

  const RedisStore = connectRedis(session);

  const redis = new Redis(process.env.REDIS_URL);

  const value = await redis.get("key");

  console.log("---Redis");
  console.log("---Redis", value);

  app.use(
    session({
      name: "qid", // Cookie name
      store: new RedisStore({
        client: redis,
        disableTouch: true, // TODO
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 25 * 365 * 10, // 10 years,
        sameSite: "lax", // CSRF
        httpOnly: true,
        secure: __prod__, // cookie only works in https
      },
      saveUninitialized: false,
      secret: "bghkjdlnhigorfkdg",
      resave: false,
    })
  );

  console.log("-------GraphQL setup start-----------");

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [GetResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ em: orm.em, req, res }), // TODO: Add comment
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
