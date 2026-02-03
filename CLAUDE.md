# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

QuickFerries - A React-based ferry and tour booking platform for Ontano Travel. This is a proprietary application.

## Development Commands

```bash
# Development
npm start              # Start dev server (default)
npm run start:dev      # Start with development environment
npm run start:prod     # Start with production environment

# Building
npm run build          # Build for production
npm run build:dev      # Build with dev environment
npm run build:prod     # Build with prod environment

# Testing
npm test               # Run tests in watch mode
npm run test:ci        # Run tests for CI (single run with coverage)
npm run test:coverage  # Run tests with coverage report
npm run test:watch     # Run tests in watch mode (explicit)

# Deployment
npm run deploy:prod    # Build and deploy to Firebase production
npm run deploy:dev     # Build and deploy to Firebase development
npm run deploy:all     # Deploy to both environments
```

## Tech Stack

- **Framework:** React 18 with Create React App
- **State Management:** Redux Toolkit
- **Routing:** React Router DOM v6
- **UI:** Material-UI (MUI Joy + Material), Bootstrap 5, Emotion
- **HTTP:** Axios
- **i18n:** i18next (Italian primary, English secondary)
- **Dates:** dayjs (primary), moment, react-datepicker
- **Hosting:** Firebase Hosting (dual-site: prod/dev)
- **Payments:** Axerve (Gestpay)
- **Analytics:** GA4, GTM, Microsoft Clarity

## Architecture

### Directory Structure

```
/src
├── /app              # Redux store configuration
├── /_api             # API integration layer (apiClient, bookingApi, tourApi)
├── /_hooks           # Custom React hooks (useAuth, useCheckoutForm, useReservations, etc.)
├── /components       # Reusable components (Checkouts, Header, Footer, ResultCard, Modals)
├── /pages            # Route-level page components
├── /features         # Redux slices by feature domain
├── /config           # API endpoints (basePath.js) and route definitions (config.js)
├── /utils            # Utilities (auth.js, dateUtils.js, language.js)
└── /assets           # Static assets
```

### API Configuration

- **Development API:** `https://dev-bookingferries.com`
- **Production API:** `https://api.quickferries.com`
- Environment determined by `REACT_APP_ENV` in `.env.development`/`.env.production`

### State Management

Redux store configured in `/src/app/store.js` with slices for:
- `viaggioForm` - Booking form state
- `account` - User authentication/account
- `reservation` - Reservation details
- `tratte`/`routes`/`resultsTratta` - Ferry routes and search results
- `tour` - Tour booking
- `prenotazioni` - User's reservations list
- `estrattoConto`/`rendicontazione` - Financial statements/reporting
- Agency-related: `registraAgenzia`, `ricercaAgenzia`, `dettaglioAgenzia`

### Authentication

- JWT token-based auth stored in localStorage/sessionStorage as `id_token`
- `getAuthHeader()` utility in `/src/utils/auth.js` for API requests
- Role checking via `ROLE_WEB_USER` authority

### Key Routes

- `/` - Search homepage
- `/results` - Ferry search results
- `/checkout` - Payment flow
- `/success` - Booking confirmation
- `/prenotazioni` - User reservations (authenticated)
- `/cerca-prenotazione` - Guest reservation lookup
- `/tabellone-partenze` - Departure board (no header/footer layout)
- `/registra-agenzia`, `/ricerca-agenzia`, `/agenzia/:id` - Agency management
- `/admin-estratto-conto`, `/agency-estratto-conto` - Financial statements

## Testing Requirements

**Every development must include tests.** Before completing any feature or bug fix:

1. Write unit tests for new utility functions and hooks
2. Write integration tests for new components
3. Run `npm run test:ci` to ensure all tests pass
4. All existing tests must continue to pass

### Test Structure

```
/src
├── /setupTests.js           # Jest configuration and global mocks
└── /__tests__
    ├── /utils               # Unit tests for utility functions
    ├── /hooks               # Tests for custom hooks
    ├── /components          # Component tests
    └── /features            # Redux slice tests
```

### Running Tests

```bash
# Run specific test file
npm test -- dateUtils.test.js

# Run tests matching a pattern
npm test -- --testNamePattern="formatDate"

# Run with coverage
npm run test:coverage
```

## Branch Strategy

### Branch principali

- **`develop`** - Branch di sviluppo principale. Tutte le feature e fix vengono mergiate qui
- **`master`** - Branch di produzione. Contiene solo codice stabile e rilasciato

### Naming convention

```
feature/<nome-descrittivo>    # Nuove funzionalità
fix/<nome-descrittivo>        # Bug fix
hotfix/<nome-descrittivo>     # Fix urgenti su master
refactor/<nome-descrittivo>   # Refactoring senza cambio funzionalità
```

**Esempi:**
- `feature/checkout-paypal`
- `feature/filtro-ricerca-date`
- `fix/login-token-expired`
- `fix/calcolo-prezzo-bambini`
- `hotfix/payment-gateway-error`
- `refactor/cleanup-unused-imports`

### Workflow

1. **Creare branch da develop:**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/nome-feature
   ```

2. **Sviluppare con commit atomici:**
   ```bash
   git add <files>
   git commit -m "Descrizione chiara del cambiamento"
   ```

3. **Eseguire i test (obbligatorio):**
   ```bash
   npm run test:ci
   ```

4. **Push e apertura PR automatica:**
   ```bash
   git push origin feature/nome-feature
   gh pr create --base develop --title "Titolo PR" --body "Descrizione"
   ```
   **IMPORTANTE:** Aprire sempre la PR automaticamente dopo il push usando `gh pr create`.

5. **Release su master:**
   - Merge da `develop` a `master` solo quando pronto per produzione
   - Taggare la release: `git tag -a v1.x.x -m "Release description"`

### Regole

- Mai committare direttamente su `master` o `develop`
- Ogni PR deve avere tutti i test passanti
- Usare messaggi di commit descrittivi in italiano o inglese (coerenti nel progetto)
- Squash merge per mantenere la history pulita

## Conventions

- All components are functional with hooks
- Custom hooks in `/_hooks` encapsulate complex logic (form handling, API calls)
- Redux uses createSlice pattern with async thunks for API operations
- Toast notifications via react-toastify for user feedback
- Affiliate tracking via `yafl` query parameter stored in cookies

## Errori Critici da Evitare

### Traduzioni (i18next)

**NON** importare `t` direttamente da `i18n.js`:
```javascript
// SBAGLIATO - `t` non è esportato da i18n.js
import i18n, { t } from "../../i18n";

// CORRETTO - usare il hook useTranslation
import { useTranslation } from "react-i18next";

const MyComponent = () => {
  const { t } = useTranslation();
  return <div>{t("chiave")}</div>;
};
```

### Loop Infiniti in useEffect

Quando si passano array/oggetti come dipendenze a `useEffect` o a custom hooks, **attenzione ai riferimenti**:

```javascript
// SBAGLIATO - crea nuovo array ad ogni render, causa loop infinito
useFetchPriceData({
  etaAdulti: localAdultAges.map((a) => parseInt(a, 10)), // Nuovo array ogni volta!
});

// CORRETTO - memoizzare l'array
const computedEtaAdulti = useMemo(() => {
  return localAdultAges.map((a) => parseInt(a, 10));
}, [localAdultAges]);

useFetchPriceData({
  etaAdulti: computedEtaAdulti, // Riferimento stabile
});
```

**Regole:**
1. Mai creare array/oggetti inline nelle props passate a hooks con useEffect
2. Usare `useMemo` per memoizzare valori calcolati
3. Verificare sempre le dipendenze degli useEffect per evitare loop
4. Testare il comportamento runtime dopo ogni modifica a hook/useEffect
