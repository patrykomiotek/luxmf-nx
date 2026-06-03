import { Component, inject, signal, Type } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ButtonComponent } from '@info-mf-nx/tim-ui';
import { EventBusService, InfoEvent } from '@info-mf-nx/event-bus';
import { EmployeeDto } from '@info-mf-nx/contracts';
import { TimModals } from '@tim-modals';
import { loadRemoteWithFallback } from './shared/load-remote-with-fallback';

const API_BASE_URL = 'http://localhost:3002/api';

@Component({
  imports: [
    CommonModule,
    RouterModule,
    ButtonComponent,
    TimModals,
    NgComponentOutlet,
  ],
  selector: 'info-mf-nx-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'shell';

  // Sygnał trzyma KLASĘ komponentu załadowaną z remota (osadzaną przez *ngComponentOutlet w app.html).
  employeeList = signal<Type<unknown> | null>(null);

  // === ĆWICZENIE 8 (panel detali) – shell SUBSKRYBUJE zdarzenia z EventBus ===
  // Shell nie wie nic o remocie employees poza wspólnym kontraktem zdarzeń.
  private eventBus = inject(EventBusService);
  private http = inject(HttpClient);

  selectedEmployee = signal<EmployeeDto | null>(null);
  lastEvent = signal<string>('—');

  private async loadEmployeeList() {
    try {
      const m = await loadRemoteWithFallback<{
        EmployeesListComponent: Type<unknown>;
      }>([() => import('employees/EmployeesList')]);
      this.employeeList.set(m.EmployeesListComponent);
    } catch {
      const { EmployeesUnavailableComponent } = await import(
        './shared/employees-unavailable.component'
      );
      this.employeeList.set(EmployeesUnavailableComponent);
    }
  }

  constructor() {
    // === ĆWICZENIE 6: Remote jako komponent (NgComponentOutlet) ===
    // TODO: odkomentuj aby zobaczyć całą stronę
    this.loadEmployeeList();

    this.eventBus.events$
      .pipe(takeUntilDestroyed())
      .subscribe((event) => this.handleEvent(event));
  }

  private handleEvent(event: InfoEvent): void {
    this.lastEvent.set(this.describe(event));

    switch (event.type) {
      case 'EMPLOYEE_SELECTED':
        // Reakcja na zdarzenie z remota: dociągamy detale z BFF i pokazujemy w panelu.
        this.http
          .get<EmployeeDto>(
            `${API_BASE_URL}/employees/${event.payload.employeeId}`
          )
          .subscribe((employee) => this.selectedEmployee.set(employee));
        break;
      case 'EMPLOYEE_REMOVED':
        if (this.selectedEmployee()?.id === event.payload.employeeId) {
          this.selectedEmployee.set(null);
        }
        break;
      case 'EMPLOYEE_FIRE_ALL':
        this.selectedEmployee.set(null);
        break;
    }
  }

  private describe(event: InfoEvent): string {
    switch (event.type) {
      case 'EMPLOYEE_SELECTED':
        return `Wybrano pracownika #${event.payload.employeeId}`;
      case 'EMPLOYEE_REMOVED':
        return `Zwolniono pracownika #${event.payload.employeeId}`;
      case 'EMPLOYEE_FIRE_ALL':
        return 'Zwolniono wszystkich pracowników';
    }
  }

  // === ĆWICZENIE 6 ===
  // Załaduj komponent z remota i ustaw sygnał. Owiń w try/catch (izolacja awarii):
  //   const m = await import('employees/EmployeesList');
  //   this.employeeList.set(m.EmployeesListComponent);
  // Rozwiązanie wzorcowe: info-mf-nx/apps/shell/src/app/app.ts
  // private async loadEmployeeList() { ... }
}
