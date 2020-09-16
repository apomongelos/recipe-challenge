import { In } from 'typeorm';
import { Ingredient } from '../entity/Ingredient';
import { RecipeIngredient } from '../entity/RecipeIngredient';

export const batchIngredient = async (recipeIds: any) => {
  const ingredientsRecipe = await RecipeIngredient.find({
    join: {
      alias: 'recipeI',
      innerJoinAndSelect: {
        ingredient: 'recipeI.ingredient',
      },
    },
    where: {
      recipeId: In(recipeIds),
    },
  });
  const recipeIdToIngredient: { [key: number]: Ingredient[] } = {};

  ingredientsRecipe.forEach((ir) => {
    if (ir.recipeId in recipeIdToIngredient) {
      recipeIdToIngredient[ir.recipeId].push((ir as any).ingredient);
    } else {
      recipeIdToIngredient[ir.recipeId] = [(ir as any).ingredient];
    }
  });
  return recipeIds.map((recipeId: number) => recipeIdToIngredient[recipeId]);
};
