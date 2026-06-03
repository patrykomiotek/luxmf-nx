// STARTER – bootstrap statyczny. Remoty są wpisane w module-federation.config.ts
// i rozwiązywane statycznie przez `nx serve shell`.
//
// === ĆWICZENIE 11: Federacja dynamiczna (manifest) ===
// Zamień ten statyczny bootstrap na ładowanie remotów z manifestu w runtime:
import { setRemoteDefinitions } from '@nx/angular/mf';
//   Step 1: webpack czyta NX_PUBLIC_TARGET_ENV i przekazuje do frontu
//   Step 2: wybór pliku manifestu wg środowiska:
//           /federation-manifest.{local|staging|production}.json
//   Step 3: walidacja manifestu przez Zod, a następnie:

function pickEnv() {
  const fromBuild = (globalThis as Record<string, unknown>)[
    'NX_PUBLIC_TARGET_ENV'
  ];

  console.log('fromBuild', fromBuild);
  console.log('globalThis', globalThis);

  return fromBuild;
}

const TARGET_ENV = pickEnv() || 'local';
const manifestFile = `/federation-manifest.${TARGET_ENV}.json`;

// const manifestSchema = schema.asyncParse(manifestFile); // safe
// try

fetch(manifestFile)
  .then((res) => res.json())
  .then((defs) => setRemoteDefinitions(defs))
  .then(() => import('./bootstrap'))
  .catch((err) => console.error(err));
// Rozwiązanie wzorcowe: info-mf-nx/apps/shell/src/main.ts

// import('./bootstrap').catch((err) => console.error(err));
