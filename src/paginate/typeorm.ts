import * as Relay from 'graphql-relay';
import {FindManyOptions, Repository} from 'typeorm';
import {PaginationRequiredArgs} from './argstype/pagination-required.argstype';
import {getPagingParameters} from './paging';

export async function getConnectionFromTypeORMRepository<T>(
  condition: Pick<FindManyOptions<T>, 'where' | 'order'>,
  connArgs: PaginationRequiredArgs,
  repository: Repository<T>,
) {
  const {limit: take, offset: skip} = getPagingParameters(connArgs);
  const connection = await repository
    .findAndCount({
      ...condition,
      skip,
      take,
    })
    .then(([entities, count]) =>
      Relay.connectionFromArraySlice(entities, connArgs, {
        arrayLength: count,
        sliceStart: skip || 0,
      }),
    );

  const count = await repository.count({...condition});

  return {
    ...connection,
    aggregate: {
      count,
    },
  };
}
