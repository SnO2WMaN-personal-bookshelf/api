import {ArgsType, Field} from '@nestjs/graphql';

@ArgsType()
export class SignUpUserArgs {
  @Field({nullable: true})
  name!: string;

  @Field({nullable: true})
  displayName?: string;

  @Field({nullable: true})
  picture?: string;
}
