import { Component, signal, Type } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgComponentOutlet } from '@angular/common';
import { ButtonComponent } from '@info-mf-nx/tim-ui';
import { TimModals } from '@tim-modals';

@Component({
  imports: [RouterModule, ButtonComponent, TimModals, NgComponentOutlet],
  selector: 'info-mf-nx-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'shell';

  // Sygnał trzyma KLASĘ komponentu załadowaną z remota (osadzaną przez *ngComponentOutlet w app.html).
  employeeList = signal<Type<unknown> | null>(null);

  constructor() {
    // === ĆWICZENIE 6: Remote jako komponent (NgComponentOutlet) ===
    // this.loadEmployeeList();
  }

  // === ĆWICZENIE 6 ===
  // Załaduj komponent z remota i ustaw sygnał. Owiń w try/catch (izolacja awarii):
  //   const m = await import('employees/EmployeesList');
  //   this.employeeList.set(m.EmployeesListComponent);
  // Rozwiązanie wzorcowe: info-mf-nx/apps/shell/src/app/app.ts
  // private async loadEmployeeList() { ... }
}
