import { MiddlewareFn } from 'type-graphql';

import { Recipe } from '../entity/Recipe';

export const isRecipeOwner: MiddlewareFn<any> = async (
  { context, args },
  next
) => {
  try {
    const recipe = await Recipe.findOneOrFail({ where: { id: args.id } });
    if (recipe.userId !== context.loggedInUserId) {
      throw new Error('No esta autorizado para dicha accion');
    }
    return next();
  } catch (error) {
    throw error;
  }
};
