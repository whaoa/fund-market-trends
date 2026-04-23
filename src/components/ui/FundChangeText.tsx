import { cn } from '#/libs/util';

import type { PropsWithChildren, PropsWithClassName } from '#/types/react';

export function FundChangeText(props: PropsWithClassName<PropsWithChildren<{ change: number }>>) {
  const { className, children, change } = props;

  return (
    <span
      className={cn(
        'tabular-nums',
        change > 0 && 'text-rose-600',
        change < 0 && 'text-emerald-600',
        className,
      )}
    >
      {children}
    </span>
  );
}

export function FundChangeBadge(props: PropsWithClassName<PropsWithChildren<{ change: number }>>) {
  const { className, children, change } = props;

  return (
    <FundChangeText
      className={cn(
        'rounded-full px-2 py-1 text-xs',
        Number(change) > 0 && 'bg-rose-600/10',
        Number(change) === 0 && 'bg-t-secondary/10',
        Number(change) < 0 && 'bg-emerald-600/10',
        className,
      )}
      change={change}
    >
      {children}
    </FundChangeText>
  );
}
