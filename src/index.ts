import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
// import mongoose from "mongoose";
import dotenv from "dotenv";
import { typeDefs } from './schema.js';
import { resolvers } from "./resolvers.js";
import { verifyToken } from "./auth.js";
import connectDB from "./db.js";

dotenv.config();

// Connect to MongoDB
// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI as string);
//     console.log("✅ MongoDB connected!");
//   } catch (error) {
//     console.error("❌ MongoDB connection error:", error);
//     process.exit(1);
//   }
// };

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Apollo Server
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

await apolloServer.start();

// Middleware to authenticate requests and attach user to context
app.use(
  "/graphql",
  expressMiddleware(apolloServer, {
    context: async ({ req }) => {
      const token = req.headers.authorization || "";
      const user = verifyToken(token.replace("Bearer ", ""));
      return { user };
    },
  })
);

// Start Express server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}/graphql`);
});
