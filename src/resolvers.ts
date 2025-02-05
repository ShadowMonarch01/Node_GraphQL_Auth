import User from "./models/User.js";
import { hashPassword, comparePassword, generateToken, verifyToken } from "./auth.js";
import { GraphQLContext } from "./types.js";

export const resolvers = {
  Query: {
    me: async (_: any, __: any, context: GraphQLContext) => {
      if (!context.user) throw new Error("Not authenticated");
      return await User.findById(context.user.id);
    },
  },

  Mutation: {
    register: async (_: any, { username, email, password }: any) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) throw new Error("User already exists");

      const hashedPassword = await hashPassword(password);
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();

      return {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        token: generateToken(newUser),
      };
    },

    login: async (_: any, { email, password }: any) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error("Invalid email or password");

      const isValid = await comparePassword(password, user.password);
      if (!isValid) throw new Error("Invalid email or password");

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        token: generateToken(user),
      };
    },
  },
};
