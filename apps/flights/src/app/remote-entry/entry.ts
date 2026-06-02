import { Component } from '@angular/core';
// import { NxWelcome } from './nx-welcome';
import { FlightsListComponent } from './flights-list.component';

@Component({
  imports: [FlightsListComponent],
  selector: 'info-mf-nx-flights-entry',
  template: `<info-mf-nx-flights-list />`,
})
export class RemoteEntry {}
