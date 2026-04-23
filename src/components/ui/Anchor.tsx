import type { PropsWithChildren, PropsWithClassName } from '#/types/react';

interface AnchorProps extends PropsWithClassName, PropsWithChildren {
  href: string;
}

export function Anchor(props: AnchorProps) {
  const { className, children, href } = props;

  return (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}
