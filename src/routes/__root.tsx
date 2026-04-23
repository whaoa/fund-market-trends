import { createRootRoute, DefaultGlobalNotFound, Outlet } from '@tanstack/react-router';

import { QueryClientProvider } from '@tanstack/react-query';

import { AppFooter } from '#/components/layouts/AppFooter';
import { AppHeader } from '#/components/layouts/AppHeader';
import { Container } from '#/components/layouts/Container';
import { globalQueryClient } from '#/libs/query';

export const Route = createRootRoute({
  component: Root,
  notFoundComponent: DefaultGlobalNotFound,
});

function Root() {
  return (
    <QueryClientProvider client={globalQueryClient}>
      <AppHeader />
      <Container as="main">
        <Outlet />
      </Container>
      <AppFooter />
    </QueryClientProvider>
  );
}
