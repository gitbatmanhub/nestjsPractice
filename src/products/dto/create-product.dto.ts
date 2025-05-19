import {
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product title',
    nullable: false,
    minLength: 1,
  })
  @IsString()
  @MinLength(5, { message: 'Product name is required' })
  title: string;

  @ApiProperty({
    example: 17.9,
    description: 'Price of Product',
    uniqueItems: false,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @ApiProperty({
    example: 'Shirt cute',
    description: 'Description of Product',
    uniqueItems: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'shirt-cute',
    description: 'Slug of Product',
    uniqueItems: true,
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({
    example: 100,
    description: 'Stock of Product',
    uniqueItems: false,
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @ApiProperty({
    example: ['M', 'S', 'XL'],
    description: 'Sizes of Product',
    uniqueItems: false,
  })
  @IsString({ each: true })
  @IsArray()
  sizes: string[];

  @ApiProperty({
    example: 'men',
    description: 'Gender of Product',
    uniqueItems: false,
  })
  @IsIn(['men', 'women', 'kid', 'unisex'])
  gender: string;

  @ApiProperty({
    example: ['summer'],
    description: 'Tags of Product',
    uniqueItems: false,
  })
  @IsString({ each: true })
  @IsArray()
  tags: string[];

  @ApiProperty({
    example: 'image.png',
    description: 'Image of Product',
    uniqueItems: false,
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  image?: string[];
}
