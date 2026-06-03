import { Component } from '@angular/core';

// === ĆWICZENIE 14: fallback UI dla niedostępnego remota ===
// Gdy remote `employees` nie wstanie (deploy w trakcie, padł CDN), host pokazuje ten
// komponent zastępczy zamiast wywalić całą stronę. Shell NIE pada – reszta UI żyje.
@Component({
  selector: 'info-mf-nx-employees-unavailable',
  template: `<p class="text-red-600">
    Moduł "Pracownicy" jest chwilowo niedostępny. Spróbuj ponownie później.
  </p>`,
})
export class EmployeesUnavailableComponent {}
