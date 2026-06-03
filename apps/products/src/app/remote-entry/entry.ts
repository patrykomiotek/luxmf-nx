import { Component } from '@angular/core';
import { NxWelcome } from './nx-welcome';
import { RouterModule } from '@angular/router';

@Component({
  // imports: [NxWelcome],
  imports: [RouterModule],
  selector: 'app-products-entry',
  // template: `<app-nx-welcome></app-nx-welcome>`,
  template: `<router-outlet />`,
})
export class RemoteEntry {}
