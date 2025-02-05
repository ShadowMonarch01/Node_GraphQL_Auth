export interface GraphQLContext {
    user?: {
      id: string;
      email: string;
    } | null;
  }
  