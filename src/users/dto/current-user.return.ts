import {Field, ObjectType, registerEnumType} from '@nestjs/graphql';
import {User} from '../entity/user.entity';

export enum CurrentUserStatus {
  NotSignedUp,
  SignedUp,
}
registerEnumType(CurrentUserStatus, {name: 'UserStatus'});

@ObjectType()
export class CurrentUserReturnType {
  @Field((type) => CurrentUserStatus)
  status!: CurrentUserStatus;

  @Field((type) => User, {nullable: true})
  user?: User;
}
