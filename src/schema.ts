import { gql } from "apollo-server";

// export const typeDefs = `#graphql
export const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    token: String
    todos: [Todo]
  }

  type Todo {
    id: ID!
    title: String!
    description: String
    completed: Boolean!
    user: User!
    updatedBy: String # Name of the last person who updated it
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    me: User
    getAllTodos: [Todo]
    getTodosByUser(userId: ID!): [Todo]
    getMyTodos: [Todo]
  }

  type Mutation {
    register(username: String!, email: String!, password: String!): User
    login(email: String!, password: String!): User
    addTodo(title: String!, description: String): Todo
    updateTodo(id: ID!, title: String, description: String, completed: Boolean): Todo
    deleteTodo(id: ID!): String
  }
`;