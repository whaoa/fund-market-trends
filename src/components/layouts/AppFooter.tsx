import { useState } from 'react';

import { Container } from './Container';

export function AppFooter() {
  const [currentYear] = useState(() => new Date().getFullYear());

  return (
    <Container className="mt-4 pt-4 pb-10 text-center text-sm text-t-secondary" as="footer">
      <p className="py-1">
        行情数据以及其他资料均来自公开数据，不构成投资建议，该数据仅供参考，使用前请核实，风险自负。
      </p>
      <p className="py-1">{`© ${currentYear} Made with ♥ by Hao`}</p>
    </Container>
  );
}
