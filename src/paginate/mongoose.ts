import * as Relay from 'graphql-relay';
import {Document, Model} from 'mongoose';
import {PaginationRequiredArgs} from './argstype/pagination-required.argstype';
import {getPagingParameters} from './paging';

export async function getConnectionFromMongooseModel<T extends Document>(
  countAggregate: Parameters<Model<T>['aggregate']>[0],
  entitiesAggregate: Parameters<Model<T>['aggregate']>[0],
  connArgs: PaginationRequiredArgs,
  model: Model<T>,
) {
  const {limit, offset: skip} = getPagingParameters(connArgs);
  const count: number = await model
    .aggregate([
      ...countAggregate,
      {
        $count: 'count',
      },
    ])
    .then((result) => result?.[0]?.count || 0);
  const aggregated = count
    ? await model.aggregate(
        [
          ...entitiesAggregate,
          skip && {
            $skip: skip,
          },
          limit && {
            $limit: limit,
          },
        ].filter(Boolean),
      )
    : [];

  const connection = Relay.connectionFromArraySlice(aggregated, connArgs, {
    arrayLength: count,
    sliceStart: skip || 0,
  });
  return {
    ...connection,
    aggregate: {count},
  };
}
