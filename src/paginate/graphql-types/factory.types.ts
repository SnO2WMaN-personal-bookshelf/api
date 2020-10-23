import {Type} from '@nestjs/common';
import {Field, Int, ObjectType} from '@nestjs/graphql';
import * as Relay from 'graphql-relay';

export function AggregateType<T>(classRef: Type<T>): any {
  @ObjectType(`${classRef.name}Aggregate`, {isAbstract: true})
  abstract class Aggregate {
    @Field((type) => Int)
    count!: number;
  }

  return Aggregate;
}

export function PageInfoType<T>(classRef: Type<T>): any {
  @ObjectType(`${classRef.name}PageInfo`, {isAbstract: true})
  abstract class PageInfo implements Relay.PageInfo {
    @Field((_type) => Boolean, {nullable: true})
    hasNextPage?: boolean | null;

    @Field((_type) => Boolean, {nullable: true})
    hasPreviousPage?: boolean | null;

    @Field((_type) => String, {nullable: true})
    startCursor?: Relay.ConnectionCursor | null;

    @Field((_type) => String, {nullable: true})
    endCursor?: Relay.ConnectionCursor | null;
  }

  return PageInfo;
}

export function EdgeType<T>(classRef: Type<T>): any {
  @ObjectType(`${classRef.name}EdgeType`, {isAbstract: true})
  abstract class Edge implements Relay.Edge<T> {
    @Field(() => classRef)
    node!: T;

    @Field((_type) => String, {
      description: 'Used in `before` and `after` args',
    })
    cursor!: Relay.ConnectionCursor;
  }

  return Edge;
}

export function ConnectionType<T>(
  classRef: Type<T>,
  {Edge, Aggregate, PageInfo}: {Edge: any; Aggregate: any; PageInfo: any},
): any {
  @ObjectType(`${classRef.name}Connection`, {isAbstract: true})
  abstract class Connection implements Relay.Connection<T> {
    @Field(() => Aggregate)
    aggregate!: typeof Aggregate;

    @Field(() => PageInfo)
    pageInfo!: Relay.PageInfo;

    @Field(() => [Edge])
    edges!: Relay.Edge<T>[];
  }

  return Connection;
}
