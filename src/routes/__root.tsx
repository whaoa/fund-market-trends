import { createRootRoute, DefaultGlobalNotFound, Outlet } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: Outlet,
  notFoundComponent: DefaultGlobalNotFound,
});
