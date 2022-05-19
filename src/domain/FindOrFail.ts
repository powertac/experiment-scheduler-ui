import {NotFoundError} from '@/domain/NotFoundError';

export function findOrFail<T>(loader: () => T|null): T {
  const entity = loader();
  if (null === entity) {
    throw new NotFoundError('could not load entity');
  }
  return entity;
}
