import { Post } from "../entities/Post";
import { MyContext } from "src/types";
import { Resolver, Query, Ctx, Arg, Int, Mutation } from "type-graphql";

@Resolver()
export class PostResolver {
  /**
   * GET Posts
   * @param em - Entity Manger coming from context: () => ({ em: orm.em })
   * @returns Array of Posts [Post]
   */
  @Query(() => [Post])
  posts(@Ctx() { em }: MyContext): Promise<Post[]> {
    return em.find(Post, {});
  }

  /**
   * GET Post by ID
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

  /**
   * ADD POST
   * @param title
   * @param em - Entity Manger coming from context: () => ({ em: orm.em })
   * @returns Post by Id: Post OR null.(GraphQL uses `nullable` for null values)
   */
  @Mutation(() => Post)
  async createPost(
    @Arg("title") title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post> {
    const post = em.create(Post, { title: title });
    await em.persistAndFlush(post);
    return post;
  }

  /**
   * UPDATE POST
   * @param title - Data to update
   * @param id - ID to update
   * @param em - Entity Manger coming from context: () => ({ em: orm.em })
   * @returns
   */
  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("title", { nullable: true }) title: string,
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    const post = await em.findOne(Post, { id });
    if (!post) {
      return null;
    }

    if (typeof title !== undefined) {
      post.title = title;
      await em.persistAndFlush(post);
    }

    return post;
  }

  /**
   * DELETE Post by ID
   * @param id
   * @param em - Entity Manger coming from context: () => ({ em: orm.em })
   * @returns
   */
  @Mutation(() => Boolean)
  async deletePost(
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<boolean> {
    const deletedPost = await em.nativeDelete(Post, { id });

    // nativeDelete gives 0 if ID not found
    if (deletedPost === 0) {
      return false;
    }

    return true;
  }
}
