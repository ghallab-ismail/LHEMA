# Project Tasks

[ ] Task 1: Defer Backend Health Check (Fix LCP/FCP Bottleneck)

Target: The React component or utility file making the initial fetch request to https://lhema.onrender.com/health.

Action: * Locate the network call.

If it is executing synchronously on page load, move the fetch request inside a useEffect hook with an empty dependency array [] so it fires asynchronously after the initial UI render.

Alternative: If the health check is not required for the frontend to function, comment out or remove the request entirely.

[ ] Task 2: Resolve Google Fonts Render-Blocking

Target: index.html and main CSS file.

Action (Option A - Quick): Append &display=swap to the end of the Google Fonts <link> href URL in index.html.

Action (Option B - Optimal): * Download the .woff2 font files locally.

Place them in the /public/fonts directory.

Remove the preconnect and stylesheet <link> tags for fonts.googleapis.com and fonts.gstatic.com from index.html.

Create @font-face rules in the main Tailwind input CSS file to load the local fonts.

[ ] Task 3: Implement Code Splitting for Unused JavaScript

Target: Main routing file or top-level component (e.g., App.jsx or main.jsx).

Action: * Identify heavy, below-the-fold components (e.g., footer, modals, secondary sections).

Refactor standard import statements for these components to dynamic imports using React.lazy(() => import('./Component')).

Wrap the lazy-loaded components within a <Suspense fallback={<div></div>}> boundary.

[ ] Task 4: Inline Critical CSS (Vite Configuration)

Target: vite.config.js (or vite.config.ts).

Action: * Install the vite-plugin-css-injected-by-js package (or equivalent for your current Vite version).

Import and add the plugin to the plugins array in the Vite configuration. This will bundle the index-aYV9UcRH.css directly into the JavaScript output, eliminating the extra network request for the stylesheet.