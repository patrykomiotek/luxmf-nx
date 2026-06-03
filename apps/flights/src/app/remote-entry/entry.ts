import { Component } from '@angular/core';
// import { NxWelcome } from './nx-welcome';
// import { FlightsListComponent } from './flights-list.component';
import { RouterModule } from '@angular/router';

@Component({
  imports: [RouterModule],
  selector: 'info-mf-nx-flights-entry',
  // template: `<info-mf-nx-flights-list />`,
  template: `
    <nav class="flights-nav">
      <a routerLink="list" routerLinkActive="active">Lista</a>
      <a routerLink="search" routerLinkActive="active">Szukaj</a>
    </nav>
    <router-outlet />
  `,
  styles: `
    :host { display: block; }
    .flights-nav { display: flex; gap: 16px; margin-bottom: 16px; }
    .flights-nav a.active { font-weight: 700; text-decoration: underline; }
  `,
})
export class RemoteEntry {}
