# Starter – Mikrofrontendy w Angularze

To jest **starter szkoleniowy** dla ćwiczeń (ciąg zadań w `../zadania/README.md`).
Bazuje na repo wzorcowym `info-mf-nx`, ale **kluczowe fragmenty MF są wykropkowane** (`// TODO` + numer ćwiczenia).

## Co jest gotowe (referencja)
- Workspace Nx + Angular 20 + Webpack Module Federation (konfiguracje `module-federation.config.ts`, `webpack.config.ts`).
- Host `shell` + remoty `flights`, `employees` (z działającymi wnętrzami), `cart` (zalążek), backend NestJS (BFF).
- Biblioteki: `contracts` (DTO), `event-bus` (szkielet), `tim-ui` + `tim-modals` (design system).
- Wnętrza remotów `flights`/`employees` służą jako **wzór** – grupa zna Angular, więc skupiamy się na MF.

## Co jest do zrobienia (TODO w kodzie)
Szukaj markerów `=== ĆWICZENIE N ===`:

| Plik | Ćwiczenie | Czego brakuje |
|------|-----------|----------------|
| `apps/shell/src/app/app.routes.ts` | 4 | lazy-load tras z remotów (`loadChildren`) |
| `apps/shell/src/app/app.ts` | 6 | ładowanie remote-komponentu przez `NgComponentOutlet` |
| `libs/event-bus/src/event-bus.service.ts` | 8 | implementacja komunikacji (Subject + CustomEvent) |
| `apps/shell/src/main.ts` | 11 | federacja dynamiczna (manifest + Zod) |

Pozostałe ćwiczenia (5, 7, 9, 10, 12) rozbudowują remoty/biblioteki przez analogię do `flights`/`employees`.

## Uruchomienie
```bash
npm install
nx run-many -t serve -p backend cart flights employees shell
# shell:    http://localhost:4200
# remoty:   :4201 (flights), :4202 (cart), :4203 (employees)
# backend:  http://localhost:3002/api  (Swagger: /swagger)
nx graph   # graf zależności
```

> **Uwaga prowadzącego:** rozwiązanie każdego TODO znajdziesz 1:1 w repo `info-mf-nx`
> (kolumna „plik wzorcowy" w `../zadania/README.md`). Warto przygotować tagi/branche per ćwiczenie,
> żeby grupa, która utknie, mogła dołączyć do kolejnego kroku.
