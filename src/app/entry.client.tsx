import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { Router } from 'react-router'; // ← Use Router instead of RemixBrowser

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <Router /> {/* ← Use Router here */}
    </StrictMode>
  );
});
