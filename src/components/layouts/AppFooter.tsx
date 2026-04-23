import { Fragment, useState } from 'react';

import { Anchor } from '../ui/Anchor';
import { Container } from './Container';

const sources = [
  { label: 'Tencent Securities', href: 'https://stockapp.finance.qq.com' },
];

export function AppFooter() {
  const [currentYear] = useState(() => new Date().getFullYear());

  return (
    <Container className="mt-4 pt-4 pb-10 text-center text-sm text-t-secondary" as="footer">
      <p className="py-1">
        {`Data sources: `}
        {sources.map(({ label, href }, index) => (
          <Fragment key={label}>
            {index > 0 ? ` · ` : null}
            <Anchor className="underline" href={href}>{label}</Anchor>
          </Fragment>
        ))}
      </p>
      <p className="py-1">{`© ${currentYear} Made with ♥ by Hao`}</p>
    </Container>
  );
}
