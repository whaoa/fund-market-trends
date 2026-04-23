import { cn } from '#/libs/util';

import type { PropsWithChildren, PropsWithClassName } from '#/types/react';

export function CardRoot(props: PropsWithClassName<PropsWithChildren>) {
  const { className, children } = props;

  return (
    <section
      className={cn(
        'rounded-lg border border-g-border',
        'bg-g-bg-s shadow-[0_4px_12px_-2px] shadow-black/10',
        className,
      )}
    >
      {children}
    </section>
  );
}

export function CardHeader(props: PropsWithClassName<PropsWithChildren>) {
  const { className, children } = props;
  return <header className={cn('px-4 pt-4 pb-3', className)}>{children}</header>;
}

export function CardContent(props: PropsWithClassName<PropsWithChildren>) {
  const { className, children } = props;
  return <main className={cn('p-4', className)}>{children}</main>;
}
