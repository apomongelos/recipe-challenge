import { Category } from '../entity/Category';

export const batchCategory = async (categoryIds: any) => {
  const categories = await Category.createQueryBuilder('category')
    .where('category.id IN (:...categories)', { categories: categoryIds })
    .getMany();

  return categoryIds.map((categoryId: number) =>
    categories.find((category) => category.id === categoryId)
  );
};
