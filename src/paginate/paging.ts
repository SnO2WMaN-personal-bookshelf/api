import * as Relay from 'graphql-relay';
import {FindManyOptions, Repository} from 'typeorm';
import {BaseConnectionArgs} from './argstype/base-connection.argstype';

export type PagingMeta =
  | {pagingType: 'forward'; after?: string; first: number}
  | {pagingType: 'backward'; before?: string; last: number}
  | {pagingType: 'none'};

function getMeta(args: BaseConnectionArgs): PagingMeta {
  const {first = 0, last = 0, after, before} = args;

  if (Boolean(first) || Boolean(after))
    return {pagingType: 'forward', after, first};
  else if (Boolean(last) || Boolean(before))
    return {pagingType: 'forward', after, first};
  else return {pagingType: 'none'};
}

export function getPagingParameters(args: BaseConnectionArgs) {
  const meta = getMeta(args);

  switch (meta.pagingType) {
    case 'forward': {
      return {
        limit: meta.first,
        offset: meta.after ? Relay.cursorToOffset(meta.after) + 1 : 0,
      };
    }
    case 'backward': {
      const {last, before} = meta;
      let limit = last;
      let offset = Relay.cursorToOffset(before!) - last;

      // Check to see if our before-page is underflowing past the 0th item
      if (offset < 0) {
        // Adjust the limit with the underflow value
        limit = Math.max(last + offset, 0);
        offset = 0;
      }

      return {offset, limit};
    }
    default:
      return {};
  }
}

export async function findAndPaginate<T>(
  condition: Pick<FindManyOptions<T>, 'where' | 'order'>,
  connArgs: BaseConnectionArgs,
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
