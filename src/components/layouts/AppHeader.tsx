import { Link } from '@tanstack/react-router';

import { APP_TITLE } from '#/libs/constant';

import { FilledLogoIcon } from '../icons/Logo';
import { Container } from './Container';

export function AppHeader() {
  return (
    <Container className="pt-6 pb-4" as="header">
      <h1>
        <Link className="flex items-center w-max font-bold text-3xl" to="/">
          <FilledLogoIcon className="mr-2 w-8 h-8" />
          {APP_TITLE}
        </Link>
      </h1>
      <p className="mt-3 text-t-secondary">
        用更平静的视角看今天的市场波动。
        追踪上涨与回落，观察关注点的迁移，快速识别趋势，并更自信地做决策。
      </p>
    </Container>
  );
}
