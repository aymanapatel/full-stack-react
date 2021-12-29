import { Post } from "../entities/Post";
import { MyContext } from "src/types";
import { Resolver, Query, Ctx, Arg, Int } from "type-graphql";

@Resolver()
export class PostResolver {
  /**
   *
   * @param em - Entity Manger coming from context: () => ({ em: orm.em })
   * @returns Array of Posts [Post]
   */
  @Query(() => [Post])
  posts(@Ctx() { em }: MyContext): Promise<Post[]> {
    return em.find(Post, {});
  }

  /**
   *
   * @param id
   * @param em - Entity Manger coming from context: () => ({ em: orm.em })
   * @returns Post by Id: Post OR null.(GraphQL uses `nullable` for null values)
   */
  @Query(() => Post, { nullable: true })
  post(
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    return em.findOne(Post, { id });
  }
}
