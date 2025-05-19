import { IsOptional, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @ApiProperty({
    description: 'How many rows do you need',
    default: '10',
    example: '10',
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: number;

  @ApiProperty({
    description: 'How many rows do you want to skip',
    default: '0',
  })
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  offset?: number;
}
