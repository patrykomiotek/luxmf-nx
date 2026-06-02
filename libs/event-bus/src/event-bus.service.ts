import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

// Kontrakt zdarzeń – discriminated union. To też jest "kontrakt" między MF: współdziel go.
// W ĆWICZENIU 10 (MF User) rozszerzysz go o np. USER_LOGGED_IN / USER_LOGGED_OUT.
export type InfoEvent =
  | { type: 'EMPLOYEE_SELECTED'; payload: { employeeId: number } }
  | { type: 'EMPLOYEE_REMOVED'; payload: { employeeId: number } }
  | { type: 'EMPLOYEE_FIRE_ALL' };

// === ĆWICZENIE 8: Event-bus (komunikacja przez zdarzenia) ===
// Komunikacja między mikrofrontendami:
//  - każdy MF może mieć własną instancję serwisu, więc sam Subject NIE przekracza
//    granicy MF -> rozgłaszamy zdarzenia na `window` przez CustomEvent('info-event').
//  - jeden, wspólny kanał: metody akcji rozgłaszają na window, a listener window
//    karmi lokalny strumień (emitInfoEvent). Dzięki temu KAŻDA instancja emituje
//    dane zdarzenie dokładnie raz (brak podwójnej emisji u nadawcy).
const INFO_EVENT = 'info-event';

@Injectable({
  providedIn: 'root',
})
export class EventBusService {
  private infoEvents$ = new Subject<InfoEvent>();

  // Subskrybują to MF nasłuchujące zdarzeń (np. panel detali w shellu).
  events$: Observable<InfoEvent> = this.infoEvents$.asObservable();

  constructor() {
    // 3. Nasłuch zdarzeń z window i ponowna emisja do lokalnego strumienia.
    window.addEventListener(INFO_EVENT, (e: Event) => {
      this.emitInfoEvent((e as CustomEvent<InfoEvent>).detail);
    });
  }

  // 1. Emisja zdarzenia do lokalnego strumienia RxJS.
  emitInfoEvent(infoEvent: InfoEvent): void {
    this.infoEvents$.next(infoEvent);
  }

  selectEmployeeEvent(id: number): void {
    this.broadCastInfoEvents({
      type: 'EMPLOYEE_SELECTED',
      payload: { employeeId: id },
    });
  }

  removeEmployeeEvent(id: number): void {
    this.broadCastInfoEvents({
      type: 'EMPLOYEE_REMOVED',
      payload: { employeeId: id },
    });
  }

  fireAllEmployeesEvent(): void {
    this.broadCastInfoEvents({ type: 'EMPLOYEE_FIRE_ALL' });
  }

  // 2. Rozgłoszenie zdarzenia na window (kanał między-MF).
  broadCastInfoEvents(infoEvent: InfoEvent): void {
    window.dispatchEvent(new CustomEvent(INFO_EVENT, { detail: infoEvent }));
  }
}
