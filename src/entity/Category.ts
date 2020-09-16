import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  BaseEntity,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Field, ObjectType, ID } from 'type-graphql';
import { Recipe } from './Recipe';

@ObjectType()
@Entity()
export class Category extends BaseEntity {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  name: string;

  // @Field()
  @CreateDateColumn()
  createdAt: Date;

  // @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  // @Field({ nullable: true })
  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Recipe, (recipe) => recipe.category)
  recipes: Recipe[];
}
