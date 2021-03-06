import { EntityManager, Connection, IDatabaseDriver } from "@mikro-orm/core";
import { Request, Response } from "express";

export type MyContext = {
  em: EntityManager<IDatabaseDriver<Connection>>;
  req: Request & { session?: Express }; // Add session  type
  res: Response;
};
