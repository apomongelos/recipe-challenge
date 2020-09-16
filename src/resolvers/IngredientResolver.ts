import {
  Query,
  Resolver,
  Mutation,
  Arg,
  ID,
  UseMiddleware,
} from 'type-graphql';

import { Ingredient } from '../entity/Ingredient';
import { Recipe } from '../entity/Recipe';
import { RecipeIngredient } from '../entity/RecipeIngredient';
import { isAuth } from '../middleware/isAuth';
import { IngredientCreateInput } from './validators/IngredientCreateInput';
import { IngredientUpdateInput } from './validators/IngredientUpdateInput';

@Resolver()
export class IngredientResolver {
  @UseMiddleware(isAuth)
  @Query(() => [Ingredient])
  async getIngredients(): Promise<Ingredient[]> {
    return await Ingredient.find();
  }

  @UseMiddleware(isAuth)
  @Query(() => Ingredient)
  async getOneIngredient(@Arg('id', () => ID) id: number): Promise<Ingredient> {
    try {
      const ingredient = await Ingredient.findOne({ id: id });
      if (!ingredient) throw new Error('Ingrediente no encontrado');
      return ingredient;
    } catch (error) {
      return error;
    }
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Ingredient)
  async createIngredient(
    @Arg('input', () => IngredientCreateInput)
    newIngredientData: IngredientCreateInput
  ): Promise<Ingredient> {
    try {
      const newIngredient = await Ingredient.create({
        ...newIngredientData,
      }).save();
      return newIngredient;
    } catch (error) {
      throw error;
    }
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Ingredient)
  async updateIngredient(
    @Arg('id', () => ID) id: number,
    @Arg('input', () => IngredientUpdateInput) input: IngredientUpdateInput
  ): Promise<Ingredient | undefined> {
    try {
      await Ingredient.update({ id }, input);
      const updatedIngredient = await Ingredient.findOne({ id: id });
      return updatedIngredient;
    } catch (error) {
      throw error;
    }
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Ingredient)
  async deleteIngredient(@Arg('id', () => ID) id: number): Promise<Ingredient> {
    try {
      const ingredient = await Ingredient.findOne(id);
      if (!ingredient) throw new Error('No encontrado');

      const ingredientSoftRemove = await Ingredient.softRemove(ingredient);

      const recipes = await RecipeIngredient.find({
        ingredientId: ingredientSoftRemove.id,
      });
      recipes.forEach(async (recipe) => {
        const result = await RecipeIngredient.find({
          where: { recipeId: recipe.recipeId },
        });
        if (Object.keys(result).length === 1) {
          const eliminatedRecipe = await Recipe.find({
            where: { id: recipe.recipeId },
          });
          await Recipe.softRemove(eliminatedRecipe);
        }
      });
      const recipesSoftRemove = await RecipeIngredient.softRemove(recipes);
      return ingredientSoftRemove;
    } catch (error) {
      return error;
    }
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Ingredient)
  async restoreIngredient(@Arg('id', () => ID) id: number) {
    try {
      const ingredient = await Ingredient.findOne(
        { id: id },
        { withDeleted: true }
      );
      if (!ingredient) throw new Error('No encontrado');

      const entySoftRestore = await Ingredient.update(
        { id },
        { deletedAt: 'null' }
      );

      const recipes = await RecipeIngredient.find({
        where: { ingredientId: ingredient.id },
        withDeleted: true,
      });
      recipes.forEach(async (recipe) => {
        const recipeIngredientCreated = await RecipeIngredient.update(
          { ingredientId: ingredient.id },
          { deletedAt: 'null' }
        );
        const result = await RecipeIngredient.find({
          where: { recipeId: recipe.recipeId },
        });
        if (Object.keys(result).length === 1) {
          const updateRecipe = await Recipe.update(
            { id: recipe.recipeId },
            { deletedAt: 'null' }
          );
        }
      });
      return ingredient;
    } catch (error) {
      return error;
    }
  }
}
