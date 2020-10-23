import {ArgsType, Field, Int} from '@nestjs/graphql';
import {IsBase64, IsInt, IsOptional, IsPositive, Max} from 'class-validator';

export const FETCH_DEFAULT = 50;
export const FETCH_MAX = 100;

@ArgsType()
export class PaginateArgsType {
  @Field((type) => String, {nullable: true})
  @IsBase64()
  @IsOptional()
  after?: string;

  @Field(() => Int, {nullable: true, defaultValue: FETCH_DEFAULT})
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Max(FETCH_MAX)
  first?: number;
}
