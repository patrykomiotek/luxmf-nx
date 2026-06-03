// === ĆWICZENIE 14: izolacja awarii + backupowa instancja remota/shella ===
//
// Pytanie z warsztatu: „czy w razie awarii shella można w tle postawić backupową instancję?"
// Dwie warstwy odporności:
//
//  A) SHELL (host) – to robi INFRASTRUKTURA, nie kod Angulara:
//     wiele replik hosta za load-balancerem + health-check (`/healthz`) + auto-restart (k8s,
//     blue/green). Padnięty pod jest wycinany z rotacji, ruch idzie na zdrowe instancje.
//     W kodzie zostaje sensowny stan błędu: globalny ErrorHandler + ekran „spróbuj ponownie".
//
//  B) REMOTE – to robimy w kodzie hosta: jeśli remote nie wstanie (deploy w trakcie, padł CDN),
//     spróbuj BACKUPOWEGO źródła, a na końcu pokaż fallback UI zamiast wywalić całą stronę
//     (rozszerzenie try/catch z Ćw. 6). Adresy backupowe biorą się z manifestu (Ćw. 15).
//
// Ten helper jest CELOWO niezależny od konkretnego API federacji: przyjmuje listę „loaderów"
// (każdy to próba załadowania tego samego modułu z innego źródła) i zwraca pierwszy sukces.
// Dzięki temu zadziała i z `import('flights/Routes')`, i z `loadRemote(...)` z @nx/angular/mf.
//
// Wpięcie: patrz apps/shell/src/app/app.routes.ts oraz app.ts (`// === ĆWICZENIE 14 ===`).
// Pełne rozwiązanie: prowadzacy/rozwiazania-rozszerzone.md (Ćw. 14).

export type RemoteLoader<T> = () => Promise<T>;

/**
 * Próbuje załadować ten sam wystawiony moduł z kilku źródeł po kolei (primary -> backupy).
 * Zwraca pierwszy, który się powiedzie. Gdy WSZYSTKIE padną – rzuca ostatni błąd
 * (łapie go wywołujący i pokazuje fallback UI / komponent zastępczy).
 *
 * @param loaders  kolejność prób, np. [() => import('flights/Routes'), () => loadFromBackup()]
 * @param onError  opcjonalny callback po każdej nieudanej próbie (logowanie / telemetria)
 */
export async function loadRemoteWithFallback<T>(
  loaders: RemoteLoader<T>[],
  onError?: (error: unknown, attempt: number) => void,
): Promise<T> {
  let lastError: unknown;

  for (let i = 0; i < loaders.length; i++) {
    try {
      return await loaders[i]();
    } catch (error) {
      lastError = error;
      onError?.(error, i);
      console.warn(`[MF] źródło #${i + 1} niedostępne, próbuję backupu...`, error);
    }
  }

  throw lastError ?? new Error('Nie udało się wczytać remota z żadnego źródła');
}
