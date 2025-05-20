import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../../products/entities';
import { ApiProperty } from '@nestjs/swagger';
import { ObjectType } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';

@Entity({ name: 'users' })
@ObjectType()
export class User {
  @ApiProperty({
    example: '7f2c70ed-121c-4cd6-ba38-8dc8ad0466c6',
    uniqueItems: true,
    description: 'Id of User',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'email@example.com',
    uniqueItems: true,
    description: 'Email of User',
  })
  @Column('text', { unique: true })
  email: string;

  @ApiProperty({
    example: 'ThisI5Str0ngPasswordExamp13',
    uniqueItems: false,
    description: 'Password of User',
  })
  @Exclude()
  @Column('text', { select: false })
  password: string;

  @ApiProperty({
    example: 'Name Complete',
    uniqueItems: false,
    description: 'Name Complete of User',
  })
  @Column('text')
  fullName: string;

  @ApiProperty({
    example: true,
    uniqueItems: false,
    description: 'Status of User',
    default: true,
  })
  @Column('bool', { default: true })
  isActive: boolean;

  @ApiProperty({
    example: ['user'],
    uniqueItems: false,
    description: 'Role of User',
    default: ['user'],
  })
  @Column('text', { array: true, default: ['user'] })
  role: string[];

  @OneToMany(() => Product, (product) => product.user)
  product: Product;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  @BeforeInsert()
  checkEmailInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkEmailUpdate() {
    this.checkEmailInsert();
  }
}
