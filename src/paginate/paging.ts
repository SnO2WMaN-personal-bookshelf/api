import * as Relay from 'graphql-relay';
import {PaginationRequiredArgs} from './argstype/pagination-required.argstype';

export type PagingMeta =
  | {pagingType: 'forward'; after?: string; first: number}
  | {pagingType: 'backward'; before?: string; last: number}
  | {pagingType: 'none'};

function getMeta(args: PaginationRequiredArgs): PagingMeta {
  const {first = 0, last = 0, after, before} = args;

  if (Boolean(first) || Boolean(after))
    return {pagingType: 'forward', after, first};
  else if (Boolean(last) || Boolean(before))
    return {pagingType: 'forward', after, first};
  else return {pagingType: 'none'};
}

export function getPagingParameters(args: PaginationRequiredArgs) {
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
