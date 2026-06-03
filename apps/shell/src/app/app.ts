import { Component, inject, signal, Type } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { NgComponentOutlet } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { loadRemoteModule } from '@nx/angular/mf';
import { ButtonComponent } from '@info-mf-nx/tim-ui';
import { EventBusService } from '@info-mf-nx/event-bus';
import { TimModals } from '@tim-modals';

import { loadRemoteWithFallback } from './shared/load-remote-with-fallback';
import { SessionService } from './auth/session.service';

@Component({
  imports: [RouterModule, ButtonComponent, TimModals, NgComponentOutlet],
  selector: 'info-mf-nx-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'shell';

  private router = inject(Router);
  private bus = inject(EventBusService);
  private session = inject(SessionService);

  // === ĆWICZENIE 17: stan sesji w navbarze ===
  // Sygnał z SessionService – navbar reaguje reaktywnie na login/logout/wygaśnięcie.
  readonly user = this.session.user;
  // Komunikat dla użytkownika po automatycznym wylogowaniu (TTL).
  readonly sessionMessage = signal<string | null>(null);

  // Sygnał trzyma KLASĘ komponentu załadowaną z remota (osadzaną przez *ngComponentOutlet w app.html).
  employeeList = signal<Type<unknown> | null>(null);

  constructor() {
    // === ĆWICZENIE 6 + 14: Remote jako komponent (NgComponentOutlet) z izolacją awarii ===
    this.loadEmployeeList();

    // === ĆWICZENIE 16: host wykonuje nawigację na prośbę remota (ROUTE_CHANGE_REQUESTED) ===
    // Remote nie zna struktury tras hosta – wysyła tylko intencję, host nawiguje.
    this.bus.events$
      .pipe(
        filter((e) => e.type === 'ROUTE_CHANGE_REQUESTED'),
        takeUntilDestroyed()
      )
      .subscribe((e) =>
        this.router.navigate(
          (e as Extract<typeof e, { type: 'ROUTE_CHANGE_REQUESTED' }>).payload
            .commands as unknown[]
        )
      );

    // === ĆWICZENIE 17: reakcja hosta na wygaśnięcie sesji ===
    // SessionService po upływie TTL woła bus.sessionExpired() (emit + broadcast). Host pokazuje
    // komunikat i wraca na stronę główną. Dzięki event-busowi tak samo zareagowałby każdy MF.
    this.bus.events$
      .pipe(
        filter((e) => e.type === 'SESSION_EXPIRED'),
        takeUntilDestroyed()
      )
      .subscribe(() => {
        this.sessionMessage.set('Sesja wygasła – zaloguj się ponownie.');
        this.router.navigate(['/']);
      });
  }

  // === ĆWICZENIE 17: akcje logowania wywoływane z navbara ===
  signIn(username: string): void {
    const name = username.trim();
    if (!name) {
      return;
    }
    this.sessionMessage.set(null);
    this.session.login(name);
  }

  signOut(): void {
    this.session.logout();
    this.sessionMessage.set(null);
  }

  // === ĆWICZENIE 6 + 14 ===
  // Ładuje komponent z remota i ustawia sygnał. Próbuje źródeł po kolei (primary -> backup),
  // a gdy WSZYSTKIE padną – pokazuje fallback UI zamiast crashować całego shella.
  private async loadEmployeeList(): Promise<void> {
    try {
      const m = await loadRemoteWithFallback<{
        EmployeesListComponent: Type<unknown>;
      }>([
        () => loadRemoteModule('employees', './EmployeesList'), // primary (z manifestu, Ćw. 15)
        // Tu można dołożyć kolejne loadery z backupowych źródeł (federation-manifest.backup.json).
      ]);
      this.employeeList.set(m.EmployeesListComponent);
    } catch {
      const { EmployeesUnavailableComponent } = await import(
        './shared/employees-unavailable.component'
      );
      this.employeeList.set(EmployeesUnavailableComponent); // fallback UI – shell NIE pada
    }
  }
}
