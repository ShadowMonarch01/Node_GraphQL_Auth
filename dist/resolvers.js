import User from "./models/User.js";
import Todo from "./models/Todo.js";
import { hashPassword, comparePassword, generateToken } from "./auth.js";
export const resolvers = {
    Query: {
        me: async (_, __, context) => {
            if (!context.user)
                throw new Error("Not authenticated");
            return await User.findById(context.user.id);
        },
        getAllTodos: async () => {
            return await Todo.find().populate("user");
        },
        getTodosByUser: async (_, { userId }) => {
            return await Todo.find({ user: userId }).populate("user");
        },
        getMyTodos: async (_, __, context) => {
            if (!context.user)
                throw new Error("Not authenticated");
            return await Todo.find({ user: context.user.id }).populate("user");
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
        addTodo: async (_, { title, description }, context) => {
            if (!context.user)
                throw new Error("Not authenticated");
            const newTodo = new Todo({
                title,
                description,
                user: context.user.id,
            });
            await newTodo.save();
            return await newTodo.populate("user");
        },
        updateTodo: async (_, { id, title, description, completed }, context) => {
            if (!context.user)
                throw new Error("Not authenticated");
            const todo = await Todo.findById(id);
            if (!todo)
                throw new Error("Todo not found");
            // Update fields only if provided
            if (title !== undefined)
                todo.title = title;
            if (description !== undefined)
                todo.description = description;
            if (completed !== undefined)
                todo.completed = completed;
            // Store the user who updated the todo
            const user = await User.findById(context.user.id);
            todo.updatedBy = user ? user.username : "Unknown";
            await todo.save();
            return await todo.populate("user");
        },
        deleteTodo: async (_, { id }, context) => {
            if (!context.user)
                throw new Error("Not authenticated");
            const todo = await Todo.findById(id);
            if (!todo)
                throw new Error("Todo not found");
            if (todo.user.toString() !== context.user.id) {
                throw new Error("You can only delete your own todos");
            }
            await Todo.findByIdAndDelete(id);
            return "Todo successfully deleted";
        },
    },
    User: {
        todos: async (user) => {
            return await Todo.find({ user: user.id });
        },
    },
};
