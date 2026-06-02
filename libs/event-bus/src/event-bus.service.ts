import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

// Kontrakt zdarzeń – discriminated union. To też jest "kontrakt" między MF: współdziel go.
// W ĆWICZENIU 10 (MF User) rozszerzysz go o np. USER_LOGGED_IN / USER_LOGGED_OUT.
export type InfoEvent =
  | { type: 'EMPLOYEE_SELECTED'; payload: { employeeId: number } }
  | { type: 'EMPLOYEE_REMOVED'; payload: { employeeId: number } }
  | { type: 'EMPLOYEE_FIRE_ALL' };

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
    // TODO (Ćw. 8): window.addEventListener('info-event', (e: any) => this.emitInfoEvent(e.detail));
  }

  emitInfoEvent(_infoEvent: InfoEvent): void {
    // TODO (Ćw. 8): this.infoEvents$.next(_infoEvent);
  }

  selectEmployeeEvent(_id: number): void {
    // TODO (Ćw. 8): zbuduj zdarzenie EMPLOYEE_SELECTED, emitInfoEvent(...) + broadCastInfoEvents(...)
  }

  removeEmployeeEvent(_id: number): void {
    // TODO (Ćw. 8): analogicznie EMPLOYEE_REMOVED
  }

  fireAllEmployeesEvent(): void {
    // TODO (Ćw. 8): analogicznie EMPLOYEE_FIRE_ALL
  }

  broadCastInfoEvents(_infoEvent: InfoEvent): void {
    // TODO (Ćw. 8): window.dispatchEvent(new CustomEvent('info-event', { detail: _infoEvent }));
  }
}
