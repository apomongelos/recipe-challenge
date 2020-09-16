import {
  Query,
  Resolver,
  Mutation,
  Arg,
  FieldResolver,
  Root,
  ID,
  Ctx,
  UseMiddleware,
  InputType,
  Field,
} from 'type-graphql';

import { Recipe } from '../entity/Recipe';
import { Ingredient } from '../entity/Ingredient';
import { Category } from '../entity/Category';
import { User } from '../entity/User';
import { RecipeIngredient } from '../entity/RecipeIngredient';
import { RecipeCreateInput } from './validators/RecipeCreateInput';
import { RecipeUpdateInput } from './validators/RecipeUpdateInput';
import { isAuth } from '../middleware/isAuth';
import { isRecipeOwner } from '../middleware/isRecipeOwner';

@InputType()
export class FilterSearch {
  @Field({ nullable: true })
  category?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  ingredient?: string;
}

@Resolver(Recipe)
export class RecipeResolver {
  @FieldResolver(() => [Ingredient])
  async ingredients(@Root() parent: Recipe, @Ctx() ctx: any) {
    try {
      return await ctx.loaders.ingredient.load(Number(parent.id));
    } catch (error) {
      throw error;
    }
  }

  @FieldResolver(() => Category)
  async category(@Root() parent: Recipe, @Ctx() ctx: any) {
    try {
      return await ctx.loaders.category.load(Number(parent.categoryId));
    } catch (error) {
      throw error;
    }
  }

  @FieldResolver(() => User)
  async user(@Root() parent: Recipe, @Ctx() ctx: any) {
    try {
      return ctx.loaders.user.load(Number(parent.userId));
    } catch (error) {
      throw error;
    }
  }

  @UseMiddleware(isAuth)
  @Query(() => [Recipe])
  async getRecipes(
    @Arg('filter', () => FilterSearch, { nullable: true }) filters: FilterSearch
  ): Promise<Recipe[]> {
    try {
      if (typeof filters !== 'undefined') {
        if (Object.keys(filters).length > 1) {
          throw new Error('Solo puede filtrar por un campo');
        }
        if (filters.name) {
          return await Recipe.find({ where: { name: filters.name } });
        }
        if (filters.category) {
          return await Recipe.find({
            join: {
              alias: 'recipeI',
              innerJoin: {
                category: 'recipeI.category',
              },
            },
            where: (qb: any) => {
              qb.where('category.name = :categoryName', {
                categoryName: filters.category,
              });
            },
          });
        }
        if (filters.ingredient) {
          return await Recipe.createQueryBuilder('recipe')
            .innerJoinAndSelect(
              RecipeIngredient,
              'recipe_ingredient',
              'recipe.id = recipe_ingredient.recipeId'
            )
            .innerJoinAndSelect(
              Ingredient,
              'ingredient',
              'recipe_ingredient.ingredientId = ingredient.id'
            )
            .where('ingredient.name = :name', { name: filters.ingredient })
            .getMany();
        }
      }
      return await Recipe.find();
    } catch (error) {
      throw error;
    }
  }

  @UseMiddleware(isAuth)
  @Query(() => Recipe)
  async getOneRecipe(@Arg('id', () => ID) id: number): Promise<Recipe> {
    try {
      const recipe = await Recipe.findOne({ where: { id: id } });
      if (!recipe) throw new Error('Recipe no encontrada');
      return recipe;
    } catch (error) {
      return error;
    }
  }

  @UseMiddleware(isAuth)
  @Query(() => [Recipe])
  async getMyRecipes(@Ctx() ctx: any) {
    const recipes = await Recipe.find({
      where: { userId: ctx.loggedInUserId },
    });
    return recipes;
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Recipe)
  async createRecipe(
    @Arg('input', () => RecipeCreateInput)
    { name, description, categoryId, ingredients }: RecipeCreateInput,
    @Ctx() ctx: any
  ): Promise<Recipe> {
    try {
      const recipeCreated = await Recipe.create({
        name: name,
        description: description,
        categoryId: categoryId,
        userId: ctx.loggedInUserId,
      }).save();

      for (let index = 0; index < ingredients.length; index++) {
        await RecipeIngredient.create({
          ingredientId: ingredients[index],
          recipeId: recipeCreated.id,
        }).save();
      }

      return recipeCreated;
    } catch (error) {
      throw error;
    }
  }

  @UseMiddleware(isAuth, isRecipeOwner)
  @Mutation(() => Recipe, { nullable: true })
  async updateRecipe(
    @Arg('id', () => ID) id: number,
    @Arg('input', () => RecipeUpdateInput)
    { name, description, categoryId, ingredients }: RecipeUpdateInput
  ): Promise<Recipe | undefined> {
    try {
      if (name) {
        const recipeNameUpdated = await Recipe.update({ id }, { name: name });
      }
      if (description) {
        const recipeDescriptionUpdated = await Recipe.update(
          { id },
          { description: description }
        );
      }
      if (categoryId) {
        const recipeCategoryUpdated = await Recipe.update(
          { id },
          { categoryId: categoryId }
        );
      }
      if (ingredients) {
        ingredients.forEach(async (ingredient) => {
          const recipeIngredientCreated = await RecipeIngredient.update(
            { recipeId: id },
            { ingredientId: ingredient }
          );
        });
      }
      const updatedIngredient = await Recipe.findOne({ id: id });
      return updatedIngredient;
    } catch (error) {
      throw error;
    }
  }

  @UseMiddleware(isAuth, isRecipeOwner)
  @Mutation(() => Recipe)
  async deleteRecipe(@Arg('id', () => ID) id: number) {
    try {
      const recipe = await Recipe.findOne(id);
      if (!recipe) throw new Error('No encontrado');

      const recipeSoftRemove = await Recipe.softRemove(recipe);

      const ingredients = await RecipeIngredient.find({
        recipeId: recipeSoftRemove.id,
      });
      const recipesSoftRemove = await RecipeIngredient.softRemove(ingredients);
      return recipeSoftRemove;
    } catch (error) {
      throw error;
    }
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Recipe)
  async restoreRecipe(@Arg('id', () => ID) id: number) {
    try {
      const recipe = await Recipe.findOne({ id: id }, { withDeleted: true });
      if (!recipe) throw new Error('No encontrado');

      const entySoftRestore = await Recipe.update(
        { id },
        { deletedAt: 'null' }
      );

      const ingredients = await RecipeIngredient.find({
        where: { recipeId: recipe.id },
        withDeleted: true,
      });
      if (ingredients) {
        ingredients.forEach(async (ingredient) => {
          const recipeIngredientCreated = await RecipeIngredient.update(
            { recipeId: id },
            { deletedAt: 'null' }
          );
        });
      }
      return recipe;
    } catch (error) {
      return error;
    }
  }
}
