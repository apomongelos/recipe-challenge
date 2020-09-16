import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { createConnection } from 'typeorm';
import { buildSchema } from 'type-graphql';
import * as dotEnv from 'dotenv';
import DataLoader from 'dataloader';

import { UserResolver } from './resolvers/UserResolver';
import { RecipeResolver } from './resolvers/RecipeResolver';
import { CategoryResolver } from './resolvers/CategoryResolver';
import { IngredientResolver } from './resolvers/IngredientResolver';
import { verifyUser } from './context/verifyUser';
import { batchUsers } from './loaders/userLoader';
import { batchCategory } from './loaders/categoryLoader';
import { batchIngredient } from './loaders/ingredientLoader';

(async () => {
  try {
    const result = dotEnv.config();

    const app = express();

    const connection = await createConnection();

    const apolloServer = new ApolloServer({
      schema: await buildSchema({
        resolvers: [
          UserResolver,
          CategoryResolver,
          RecipeResolver,
          IngredientResolver,
        ],
      }),
      context: async ({ req }: any) => {
        try {
          let contextObj = { email: '', loggedInUserId: '', loaders: {} };
          if (req) {
            await verifyUser(req);
            contextObj.email = req.email;
            contextObj.loggedInUserId = req.loggedInUserId;
          }
          contextObj.loaders = {
            user: new DataLoader((keys) => batchUsers(keys)),
            category: new DataLoader((keys) => batchCategory(keys)),
            ingredient: new DataLoader((keys) => batchIngredient(keys)),
          };
          return contextObj;
        } catch (error) {
          throw error;
        }
      },
    });

    // cors
    app.use(cors());
    // middleware
    app.use(express.json());

    apolloServer.applyMiddleware({ app, path: '/graphql' });

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Server listening on PORT: ${PORT}`);
      console.log(
        `Graphql Endpoint: http://localhost:${PORT}${apolloServer.graphqlPath}`
      );
    });
  } catch (error) {
    throw error;
  }
})();
