import { TinyFloat } from 'tinyfloat';

export function float(...args: ConstructorParameters<typeof TinyFloat>) {
  return new TinyFloat(...args);
}

export { tz } from '@date-fns/tz';

export { clsx as cn } from 'clsx';

export { format as formatDate } from 'date-fns/format';
export { parse as parseDate } from 'date-fns/parse';

export { ofetch as request } from 'ofetch';
