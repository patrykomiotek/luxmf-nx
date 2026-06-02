import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';

import { EmployeeDto } from '@info-mf-nx/contracts';
import { EventBusService } from '@info-mf-nx/event-bus';

import { EmployeeService } from './employees.service';

@Component({
  selector: 'info-mf-nx-employees-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './employees-list.html',
})
export class EmployeesListComponent {
  private employeesService = inject(EmployeeService);
  // EventBus to wspólny kontrakt między MF – remote tylko EMITUJE zdarzenia,
  // nie wie kto (i czy w ogóle) je odbiera. Subskrybentem jest panel w shellu.
  private eventBus = inject(EventBusService);

  employees$!: Observable<EmployeeDto[]>;

  constructor() {
    effect(() => {
      this.employees$ = this.employeesService.getEmployees();
    });
  }

  select(id: number): void {
    this.eventBus.selectEmployeeEvent(id);
  }

  remove(id: number): void {
    this.eventBus.removeEmployeeEvent(id);
  }

  fireAll(): void {
    this.eventBus.fireAllEmployeesEvent();
  }
}
