import { inject, Injectable, signal } from '@angular/core';
import { EventBusService } from '@info-mf-nx/event-bus';

// === ĆWICZENIE 17: sesje – sessionStorage + wygaszanie po upływie czasu ===
//
// Cel (uwaga z warsztatu: „sesje – wygaszanie po upływie konkretnego czasu"):
//  • trzymaj sesję w sessionStorage (znika po zamknięciu karty – inaczej niż localStorage),
//  • licz TTL od logowania; po jego upływie automatycznie wyloguj i rozgłoś SESSION_EXPIRED,
//  • (opcjonalnie) przedłużaj sesję przy aktywności użytkownika (sliding expiration).
//
// W realnym Nx wyniósłbyś to do `libs/auth` (lib, nie app) i współdzielił między MF.
// Tu, dla prostoty ćwiczenia, serwis żyje w shellu i propaguje stan zdarzeniami (event-bus).
//
// Co jest DO ZROBIENIA: sekcje `// TODO (Ćw. 17)`. Reszta to działający szkielet TTL.
// Pełne rozwiązanie: prowadzacy/rozwiazania-rozszerzone.md (Ćw. 17).

const SESSION_KEY = 'info-mf.session';
// Warsztatowo 15 s, żeby na żywo zobaczyć auto-logout (SESSION_EXPIRED).
// Produkcyjnie ustaw realną wartość, np. 15 * 60 * 1000 (15 min).
const SESSION_TTL_MS = 15 * 1000;

interface StoredSession {
  username: string;
  expiresAt: number; // epoch ms
}

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly bus = inject(EventBusService);

  /** Aktualny użytkownik lub null (do bindowania w navbarze shella). */
  readonly user = signal<string | null>(null);

  private expiryTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    // Po odświeżeniu strony odtwórz sesję z sessionStorage (jeśli jeszcze ważna).
    this.restore();
  }

  /** Wywoływane po poprawnym logowaniu (np. z remote `user`/`employees`). */
  login(username: string): void {
    const session: StoredSession = {
      username,
      expiresAt: Date.now() + SESSION_TTL_MS,
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    this.user.set(username);
    this.armExpiryTimer(session.expiresAt);

    // Ćw. 17: rozgłoś USER_LOGGED_IN, żeby inne MF (np. navbar, koszyk) zareagowały.
    this.bus.userLoggedIn(username);
  }

  /** Ręczny logout (przycisk) – czyści sesję i stan. */
  logout(): void {
    this.clear();
    this.bus.userLoggedOut();
  }

  private restore(): void {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return;

    const session = JSON.parse(raw) as StoredSession;
    if (session.expiresAt <= Date.now()) {
      // Sesja już wygasła między wizytami.
      this.expire();
      return;
    }
    this.user.set(session.username);
    this.armExpiryTimer(session.expiresAt);
  }

  private armExpiryTimer(expiresAt: number): void {
    if (this.expiryTimer) clearTimeout(this.expiryTimer);
    const msLeft = Math.max(0, expiresAt - Date.now());
    this.expiryTimer = setTimeout(() => this.expire(), msLeft);
  }

  /** Wygaszenie po TTL – sprzątanie + powiadomienie innych MF. */
  private expire(): void {
    this.clear();
    // Ćw. 17: subskrybent w shellu (app.ts) reaguje: pokaż „Sesja wygasła", przekieruj na /login.
    this.bus.sessionExpired();
  }

  private clear(): void {
    if (this.expiryTimer) clearTimeout(this.expiryTimer);
    this.expiryTimer = null;
    sessionStorage.removeItem(SESSION_KEY);
    this.user.set(null);
  }

  // TODO (Ćw. 17 – opcjonalnie): sliding expiration.
  // Nasłuchuj aktywności (click/keydown) i przy każdej przedłużaj sesję:
  //   touch(): void { if (this.user()) this.login(this.user()!); }  // re-arm TTL
}
