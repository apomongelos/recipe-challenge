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
export class User extends BaseEntity {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field()
  @Column()
  password: string;

  // @Field()
  @CreateDateColumn()
  createdAt: Date;

  // @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  // @Field({ nullable: true })
  @DeleteDateColumn()
  deletedAt: Date;

  // @Field((type) => [Recipe], { nullable: true })
  // @ManyToMany((type) => Recipe)
  // @JoinTable()
  // recipes: Recipe[];

  @OneToMany(() => Recipe, (recipe) => recipe.user)
  recipes: Recipe[];
}
