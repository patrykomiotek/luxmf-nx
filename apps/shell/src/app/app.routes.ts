import { loadRemoteModule } from '@nx/angular/mf';
// TODO: test me
import { loadRemote } from '@module-federation/enhanced/runtime';
import { NxWelcome } from './nx-welcome';
import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'products',
    // loadChildren: () => import('products/Routes').then((m) => m!.remoteRoutes),
    loadChildren: () =>
      loadRemoteModule('products', './Routes').then((m) => m.remoteRoutes),
  },
  // === ĆWICZENIE 4: Pierwszy remote przez routing ===
  // Lazy-load tras z remotów. Każdy remote wystawia './Routes' (entry.routes.ts),
  // host montuje je przez loadChildren – dynamicznie, wg manifestu (setRemoteDefinitions).
  {
    path: 'flights',
    loadChildren: () =>
      loadRemoteModule('flights', './Routes')
        .then((m) => m.routes)
        .catch((error) => console.log('To jest error z route')),

    // loadChildren: () =>
    //   loadRemoteModule('flights', './Routes')
    //     .then((m) => m.remoteRoutes)
    //     .catch((error) => console.log('To jest error z route')),
  },
  {
    path: 'employees',
    loadChildren: () =>
      loadRemoteModule('employees', './Routes').then((m) => m.remoteRoutes),
  },
  {
    path: 'cart',
    loadChildren: () =>
      loadRemoteModule('cart', './Routes').then((m) => m.remoteRoutes),
  },
  {
    path: '',
    component: NxWelcome,
  },
];
