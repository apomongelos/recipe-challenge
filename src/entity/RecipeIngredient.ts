import {
  Entity,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

import { Ingredient } from './Ingredient';
import { Recipe } from './Recipe';

@Entity()
export class RecipeIngredient extends BaseEntity {
  @Index()
  @PrimaryColumn()
  ingredientId: number;
  @ManyToOne(() => Ingredient, (ingredient) => ingredient.recipes)
  @JoinColumn({ name: 'ingredientId' })
  ingredient: Ingredient;

  @Index()
  @PrimaryColumn()
  recipeId: number;
  @ManyToOne(() => Recipe, (recipe) => recipe.ingredients)
  @JoinColumn({ name: 'recipeId' })
  recipe: Recipe;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
