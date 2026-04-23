import type { CSSProperties } from 'react';

export type PropsWithClassName<P = unknown> = P & {
  className?: string;
};

export type PropsWithStyle<P = unknown> = P & {
  style?: CSSProperties;
};

export type { PropsWithChildren } from 'react';
