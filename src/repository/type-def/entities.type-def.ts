import {
  DeepPartial,
  FindManyOptions as FindManyOption,
  FindOneOptions as FindOneOption,
  FindOptionsRelations,
  FindOptionsWhere,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { UpsertOptions as UpsertOption } from 'typeorm/repository/UpsertOptions';

export type FindOneWhereOptions<T> = FindOptionsWhere<T>;

export type FindOneOptions<T> = FindOneOption<T>;

export type CreateOptions<T> = DeepPartial<T>;

export type SaveOptions<T> = DeepPartial<T>;

export type UpdateOptions<T> = QueryDeepPartialEntity<T>;

export type UpsertOptions<T> = UpsertOption<T>;

export type FindRelationsOptions<T> = FindOptionsRelations<T>;

export interface FindManyOptions<T> extends FindManyOption<T> {
  skip?: number;
  take?: number;
}
