import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  BaseEntity,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Field, ObjectType, ID } from 'type-graphql';

import { Category } from './Category';
import { Ingredient } from './Ingredient';
import { User } from './User';
import { RecipeIngredient } from './RecipeIngredient';

@ObjectType()
@Entity()
export class Recipe extends BaseEntity {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  description: string;

  @Field((type) => Category, { name: 'category' })
  @Column()
  categoryId: number;
  @ManyToOne((type) => Category, (category) => category.recipes, {
    nullable: false,
    cascade: true,
  })
  @JoinColumn({ name: 'categoryId' })
  category: Category;
  
  @Field((type) => User, { name: 'user' })
  @Column()
  userId: number;
  @ManyToOne((type) => User, (user) => user.recipes, {
    nullable: false,
    cascade: true,
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  // @Field()
  @CreateDateColumn()
  createdAt: Date;

  // @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  // @Field({ nullable: true })
  @DeleteDateColumn()
  deletedAt: Date;

  @Field((type) => [Ingredient])
  @OneToMany(
    () => RecipeIngredient,
    (recipeIngredient) => recipeIngredient.recipe
  )
  ingredients: Ingredient[];
}
