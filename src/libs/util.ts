import { TinyFloat } from 'tinyfloat';

export function float(...args: ConstructorParameters<typeof TinyFloat>) {
  return new TinyFloat(...args);
}

export { clsx as cn } from 'clsx';

export { ofetch as request } from 'ofetch';
