import { Resolver, Query } from "type-graphql";

@Resolver()
export class GetResolver {
  @Query(() => String)
  get() {
    return "Hello GraphQL!";
  }
}
