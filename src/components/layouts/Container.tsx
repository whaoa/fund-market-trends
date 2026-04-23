import { cn } from '#/libs/util';

import type { PropsWithChildren, PropsWithClassName } from '#/types/react';

export interface ContainerProps extends PropsWithClassName, PropsWithChildren {
  as: 'header' | 'main' | 'footer';
}

export function Container(props: ContainerProps) {
  const { className, children, as: Root } = props;

  return (
    <Root className={cn('mx-auto px-4 md:px-6 md:max-w-3xl lg:max-w-4xl', className)}>
      {children}
    </Root>
  );
}
