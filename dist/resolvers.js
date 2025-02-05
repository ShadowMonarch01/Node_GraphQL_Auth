import User from "./models/User.js";
import { hashPassword, comparePassword, generateToken } from "./auth.js";
export const resolvers = {
    Query: {
        me: async (_, __, context) => {
            if (!context.user)
                throw new Error("Not authenticated");
            return await User.findById(context.user.id);
        },
    },
    Mutation: {
        register: async (_, { username, email, password }) => {
            const existingUser = await User.findOne({ email });
            if (existingUser)
                throw new Error("User already exists");
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
        login: async (_, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user)
                throw new Error("Invalid email or password");
            const isValid = await comparePassword(password, user.password);
            if (!isValid)
                throw new Error("Invalid email or password");
            return {
                id: user.id,
                username: user.username,
                email: user.email,
                token: generateToken(user),
            };
        },
    },
};
