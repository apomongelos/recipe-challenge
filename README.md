# Recipe challenge
This project was created with:
- NodeJS
- TypeScript
- GraphQL
- TypeGraphQL
- TypeORM
- JWT
- PostgreSQL/MySQL

You can running this entire app in dev mode use "npm run dev"
Or you can runnig in prod mode use "npm run start"

Also you can deploy use the following path https://recipe-challenge-graphql.herokuapp.com/
You need to install Postman to run mutation and querys.
Inside Postman under the APIs tab, click + New API, navigate to the Define tab, and then select Create new and add the following schema:
```
schema {
  query: Query
  mutation: Mutation
}
type Category {
  id: ID!
  name: String!
}

input CategoryCreateInput {
  name: String!
}

input CategoryUpdateInput {
  name: String
}

input FilterSearch {
  category: String
  name: String
  ingredient: String
}

type Ingredient {
  id: ID!
  name: String!
}

input IngredientCreateInput {
  name: String!
}

input IngredientUpdateInput {
  name: String
}

type LoginResponse {
  accessToken: String!
}

type Mutation {
  login(input: UserLoginInput!): LoginResponse!
  signUp(input: UserSignUpInput!): User!
  createRecipe(input: RecipeCreateInput!): Recipe!
  updateRecipe(input: RecipeUpdateInput!, id: ID!): Recipe
  deleteRecipe(id: ID!): Recipe!
  restoreRecipe(id: ID!): Recipe!
  createCategory(input: CategoryCreateInput!): Category!
  updateCategory(input: CategoryUpdateInput!, id: ID!): Category!
  deleteCategory(id: ID!): Category!
  restoreCategory(id: ID!): Category!
  createIngredient(input: IngredientCreateInput!): Ingredient!
  updateIngredient(input: IngredientUpdateInput!, id: ID!): Ingredient!
  deleteIngredient(id: ID!): Ingredient!
  restoreIngredient(id: ID!): Ingredient!
}

type Query {
  getRecipes(filter: FilterSearch): [Recipe!]!
  getOneRecipe(id: ID!): Recipe!
  getMyRecipes: [Recipe!]!
  getCategories: [Category!]!
  getOneCategory(id: ID!): Category!
  getIngredients: [Ingredient!]!
  getOneIngredient(id: ID!): Ingredient!
}

type Recipe {
  id: ID!
  name: String!
  description: String!
  category: Category!
  user: User!
  ingredients: [Ingredient!]!
}

input RecipeCreateInput {
  name: String!
  description: String!
  categoryId: ID!
  ingredients: [ID!]!
}

input RecipeUpdateInput {
  name: String
  description: String
  categoryId: ID
  ingredients: [ID!]
}

type User {
  id: ID!
  name: String!
  email: String!
  password: String!
}

input UserLoginInput {
  email: String!
  password: String!
}

input UserSignUpInput {
  name: String!
  email: String!
  password: String!
}
```
Choose GraphQL from the dropdown, and click Save.
After that in your request you can use the schema and in the path field you should use "https://recipe-challenge-graphql.herokuapp.com/graphql"
