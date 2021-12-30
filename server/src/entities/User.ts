import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType() // For array in GraphQL
@Entity()
export class User {
  @Field() //Scalar in GraphQL
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({ type: "date" })
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();

  @Field()
  @Property({ type: "text", unique: "true" })
  username!: string;

  // No Field Since it should not be part of grpahql
  @Property({ type: "text" })
  password!: string;
}
