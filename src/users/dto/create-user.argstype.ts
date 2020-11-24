import {ArgsType, Field} from '@nestjs/graphql';

@ArgsType()
export class CreateUserArgs {
  @Field({nullable: true})
  name!: string;

  @Field({nullable: true})
  displayName?: string;

  @Field({nullable: true})
  picture?: string;
}
