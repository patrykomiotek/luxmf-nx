import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

// Kontrakt zdarzeń – discriminated union. To też jest "kontrakt" między MF: współdziel go.
// W ĆWICZENIU 10 (MF User) rozszerzysz go o np. USER_LOGGED_IN / USER_LOGGED_OUT.
export type InfoEvent =
  | { type: 'EMPLOYEE_SELECTED'; payload: { employeeId: number } }
  | { type: 'EMPLOYEE_REMOVED'; payload: { employeeId: number } }
  | { type: 'EMPLOYEE_FIRE_ALL' }
  // === ĆWICZENIE 16: nawigacja przez zdarzenie (zamiast twardego RouterLink) ===
  // Remote, który wystawia komponent z linkami, NIE powinien znać struktury tras hosta
  // (dziś flight-list.html ma na sztywno `[routerLink]="['/flights', id]"` -> sprzężenie z hostem).
  // Zamiast tego remote PROSI o nawigację zdarzeniem, a host (właściciel routingu) ją wykonuje:
  | { type: 'ROUTE_CHANGE_REQUESTED'; payload: { commands: unknown[] } }
  // === ĆWICZENIE 17: sesja / stan logowania (propagacja przez zdarzenia) ===
  | { type: 'USER_LOGGED_IN'; payload: { username: string } }
  | { type: 'USER_LOGGED_OUT' }
  | { type: 'SESSION_EXPIRED' };

// === ĆWICZENIE 8: Event-bus (komunikacja przez zdarzenia) ===
// Zaimplementuj komunikację między MF:
//  1. emisja zdarzenia do strumienia (infoEvents$.next)
//  2. rozgłoszenie na window przez CustomEvent('info-event', { detail })
//  3. nasłuch window 'info-event' w konstruktorze i ponowna emisja do strumienia
//  4. publiczny strumień events$ dla subskrybentów (panel detali w shellu)
// Rozwiązanie wzorcowe: info-mf-nx/libs/event-bus/src/event-bus.service.ts
@Injectable({
  providedIn: 'root',
})
export class EventBusService {
  private infoEvents$ = new Subject<InfoEvent>();

  // Subskrybują to MF nasłuchujące zdarzeń (np. panel detali w shellu).
  events$: Observable<InfoEvent> = this.infoEvents$.asObservable();

  constructor() {
    // Nasłuch zdarzeń przychodzących z innych MF (rozgłoszonych po window) i ponowna
    // emisja do lokalnego strumienia, żeby subskrybenci w TYM MF też je dostali.
    window.addEventListener('info-event', (e: Event) =>
      this.emitInfoEvent((e as CustomEvent<InfoEvent>).detail)
    );
  }

  emitInfoEvent(infoEvent: InfoEvent): void {
    this.infoEvents$.next(infoEvent);
  }

  selectEmployeeEvent(id: number): void {
    const event: InfoEvent = {
      type: 'EMPLOYEE_SELECTED',
      payload: { employeeId: id },
    };
    this.emitInfoEvent(event);
    this.broadCastInfoEvents(event);
  }

  removeEmployeeEvent(id: number): void {
    const event: InfoEvent = {
      type: 'EMPLOYEE_REMOVED',
      payload: { employeeId: id },
    };
    this.emitInfoEvent(event);
    this.broadCastInfoEvents(event);
  }

  fireAllEmployeesEvent(): void {
    const event: InfoEvent = { type: 'EMPLOYEE_FIRE_ALL' };
    this.emitInfoEvent(event);
    this.broadCastInfoEvents(event);
  }

  broadCastInfoEvents(infoEvent: InfoEvent): void {
    window.dispatchEvent(new CustomEvent('info-event', { detail: infoEvent }));
  }

  // === ĆWICZENIE 16: remote prosi o nawigację, host ją wykonuje ===
  // Remote woła to zamiast routować bezpośrednio. Host subskrybuje events$ i robi router.navigate.
  requestRouteChange(commands: unknown[]): void {
    const event: InfoEvent = {
      type: 'ROUTE_CHANGE_REQUESTED',
      payload: { commands },
    };
    this.emitInfoEvent(event); // lokalny strumień (ten sam MF)
    this.broadCastInfoEvents(event); // przez window do hosta / innych MF
  }

  // === ĆWICZENIE 17: zdarzenia sesji ===
  userLoggedIn(username: string): void {
    const event: InfoEvent = { type: 'USER_LOGGED_IN', payload: { username } };
    this.emitInfoEvent(event);
    this.broadCastInfoEvents(event);
  }

  userLoggedOut(): void {
    const event: InfoEvent = { type: 'USER_LOGGED_OUT' };
    this.emitInfoEvent(event);
    this.broadCastInfoEvents(event);
  }

  sessionExpired(): void {
    const event: InfoEvent = { type: 'SESSION_EXPIRED' };
    this.emitInfoEvent(event);
    this.broadCastInfoEvents(event);
  }
}
