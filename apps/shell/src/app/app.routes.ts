import { NxWelcome } from './nx-welcome';
import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  // === ĆWICZENIE 4: Pierwszy remote przez routing ===
  // Lazy-load tras z remotów. Każdy remote wystawia './Routes' (entry.routes.ts),
  // host montuje je przez loadChildren.
  {
    path: 'flights',
    loadChildren: () => import('flights/Routes').then((m) => m!.remoteRoutes),
  },
  {
    path: 'employees',
    loadChildren: () => import('employees/Routes').then((m) => m!.remoteRoutes),
  },
  {
    path: 'cart',
    loadChildren: () => import('cart/Routes').then((m) => m!.remoteRoutes),
  },
  {
    path: '',
    component: NxWelcome,
  },
];
