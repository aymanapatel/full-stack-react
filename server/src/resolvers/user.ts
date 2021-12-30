import { User } from "../entities/User";
import { MyContext } from "src/types";

import {
  Resolver,
  Ctx,
  Arg,
  Mutation,
  InputType,
  Field,
  ObjectType,
  Query,
} from "type-graphql";

import argon2 from "argon2";

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]; // Null if no error. Return user.

  @Field(() => User, { nullable: true })
  user?: User; // Null if no user. Throw error.
}

@Resolver()
export class UserResolver {
  /**
   * 

   * @param em - Entity Manger coming from context: () => ({ em: orm.em })
  * @param req: Req with session
  * @returns User: 
   */
  @Query(() => User, { nullable: true })
  async me(@Ctx() { em, req }: MyContext) {
    // Loggedin
    if (!req.session.userId) {
      return null;
    }

    const user = em.findOne(User, { id: req.session.userId });
    return user;
  }

  /**
   * Register User
   * @param options : @InputType() UsernamePasswordInput
   * @param em - Entity Manger coming from context: () => ({ em: orm.em })
   * @param req: Req with session
   * @returns @ObjectType() UserResponse
   */

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const hashedPassword = await argon2.hash(options.password);

    if (options.username.length <= 2 || options.password.length <= 2) {
      console.log("---1");
      let fieldErrorMessage: string;
      const bothFieldSmall =
        options.username.length <= 2 && options.password.length <= 2;

      if (bothFieldSmall === true) {
        console.log("---2");
        fieldErrorMessage = "Username and password are short";
      } else {
        if (options.username.length <= 2) {
          console.log("---3");
          fieldErrorMessage = "Username is short";
        } else {
          console.log("---4");
          fieldErrorMessage = "Password is short";
        }
      }

      return {
        errors: [
          {
            field: "Field errors",
            message: fieldErrorMessage,
          },
        ],
      };
    }

    console.log("---NO");

    const user = em.create(User, {
      username: options.username,
      password: hashedPassword,
    });

    try {
      console.log("---a-");
      await em.persistAndFlush(user);
    } catch (err) {
      console.log("---d-", err.code);
      if (err.code === "23505") {
        return {
          errors: [
            {
              field: "username",
              message: "Username already exist",
            },
          ],
        };
      }
    }

    req.session.userId = user.id;

    return {
      user,
    };
  }

  /**
   * Login
   * @param options @InputType() UsernamePasswordInput
   * @param em - Entity Manger coming from context: () => ({ em: orm.em })
   * @param req: Req with session
   * @returns @ObjectType() UserResponse
   */
  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    console.log("----------------- Login");
    const user = await em.findOne(User, {
      username: options.username,
    });

    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "The username does not exist",
          },
        ],
      };
    }

    const validPassword = await argon2.verify(user.password, options.password);

    console.log("----passwrod", validPassword);
    if (!validPassword) {
      return {
        errors: [
          {
            field: "password",
            message: "Password is incorrect",
          },
        ],
      };
    }

    req.session.userId = user.id;

    return { user };
  }
}
