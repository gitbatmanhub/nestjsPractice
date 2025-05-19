import { ApiProperty } from '@nestjs/swagger';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from './product-image.entity';
import { User } from '../../auth/entities/user.entity';

@Entity()
export class Product {
  @ApiProperty({
    example: '24da80e9-6552-461f-a4c9-1ba28acd87de',
    uniqueItems: true,
    description: 'Id of Product',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Shirt',
    description: 'Title of Product',
    uniqueItems: false,
  })
  @Column('text', { nullable: true })
  title: string;

  @ApiProperty({
    example: 17.9,
    description: 'Price of Product',
    uniqueItems: false,
    default: 0,
  })
  @Column('float', { nullable: true, default: 0 })
  price: number;

  @ApiProperty({
    example: 'Shirt cute',
    description: 'Description of Product',
    uniqueItems: false,
  })
  @Column('text', { nullable: true })
  description: string;

  @ApiProperty({
    example: 'shirt-cute',
    description: 'Slug of Product',
    uniqueItems: true,
  })
  @Column('text', { unique: true })
  slug: string;

  @ApiProperty({
    example: 100,
    description: 'Stock of Product',
    uniqueItems: false,
  })
  @Column('int', { default: 0 })
  stock: number;

  @ApiProperty({
    example: ['M', 'S', 'XL'],
    description: 'Sizes of Product',
    uniqueItems: false,
  })
  @Column('text', { array: true })
  sizes: string[];

  @ApiProperty({
    example: 'men',
    description: 'Gender of Product',
    uniqueItems: false,
  })
  @Column('text')
  gender: string;

  @ApiProperty({
    example: ['summer'],
    description: 'Tags of Product',
    uniqueItems: false,
  })
  @Column('text', { array: true, default: [] })
  tags: string[];

  @ApiProperty({
    example: 'image.png',
    description: 'Image of Product',
    uniqueItems: false,
  })
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  image?: ProductImage[];

  @ManyToOne(() => User, (user) => user.product, { eager: true })
  user: User;

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
