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
  const [entities, count] = await repository.findAndCount({
    ...condition,
    skip,
    take,
  });
  return Relay.connectionFromArraySlice(entities, connArgs, {
    arrayLength: count,
    sliceStart: skip || 0,
  });
}
