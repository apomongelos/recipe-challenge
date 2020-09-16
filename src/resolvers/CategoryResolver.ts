import {
  Query,
  Resolver,
  Mutation,
  Arg,
  ID,
  UseMiddleware,
} from 'type-graphql';

import { Category } from '../entity/Category';
import { Recipe } from '../entity/Recipe';
import { isAuth } from '../middleware/isAuth';
import { CategoryCreateInput } from './validators/CategoryCreateInput';
import { CategoryUpdateInput } from './validators/CategoryUpdateInput';

@Resolver()
export class CategoryResolver {
  @UseMiddleware(isAuth)
  @Query(() => [Category])
  async getCategories(): Promise<Category[]> {
    return await Category.find();
  }

  @UseMiddleware(isAuth)
  @Query(() => Category)
  async getOneCategory(@Arg('id', () => ID) id: number): Promise<Category> {
    try {
      const category = await Category.findOne({ id: id });
      if (!category) throw new Error('Categoria no encontrada');
      return category;
    } catch (error) {
      return error;
    }
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Category)
  async createCategory(
    @Arg('input', () => CategoryCreateInput)
    newCategoryData: CategoryCreateInput
  ): Promise<Category> {
    try {
      const newCategory = await Category.create(newCategoryData).save();
      return newCategory;
    } catch (error) {
      throw error;
    }
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Category)
  async updateCategory(
    @Arg('id', () => ID) id: number,
    @Arg('input', () => CategoryUpdateInput) input: CategoryUpdateInput
  ): Promise<Category | undefined> {
    try {
      await Category.update({ id }, input);
      const updatedCategory = await Category.findOne({ id: id });
      return updatedCategory;
    } catch (error) {
      throw error;
    }
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Category)
  async deleteCategory(@Arg('id', () => ID) id: number): Promise<Category> {
    try {
      const categoria = await Category.findOne(id);
      if (!categoria) throw new Error('No encontrado');

      const categoriaSoftRemove = await Category.softRemove(categoria);

      const recipes = await Recipe.find({ categoryId: categoriaSoftRemove.id });
      const recipesSoftRemove = await Recipe.softRemove(recipes);
      return categoriaSoftRemove;
    } catch (error) {
      return error;
    }
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Category)
  async restoreCategory(@Arg('id', () => ID) id: number) {
    try {
      const categoria = await Category.findOne(
        { id: id },
        { withDeleted: true }
      );
      if (!categoria) throw new Error('No encontrado');

      const entySoftRestore = await Category.update(
        { id },
        { deletedAt: 'null' }
      );

      const recipes = await Recipe.find({ category: categoria });
      const recipesSoftRemove = await Recipe.update(
        { category: categoria },
        { deletedAt: 'null' }
      );
      return categoria;
    } catch (error) {
      return error;
    }
  }
}
