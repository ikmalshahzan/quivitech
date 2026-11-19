# QuiviTech — React UI prototype / WordPress migration starter

This is a React 18 + Vite + React Router + GSAP conversion of the QuiviTech editorial V3 design.

## Preview locally
`npm install`
`npm run dev`

## Architecture
- `src/components/Layout.jsx`: shared React header, navigation, footer.
- `src/components/ContentPage.jsx`: route-aware content renderer, interactive controls, GSAP animation lifecycle.
- `src/pages/content.json`: editable page section markup and page SEO metadata (11 routes).
- `src/styles/site.css`: retained editorial V3 design system.
- `src/styles/react.css`: React-specific fixes and brand tokens.

## WordPress migration options
**Recommended**: Use React as a UI prototype, then translate the design into a conventional WordPress PHP theme with ACF blocks/patterns. Convert React layout into header.php/footer.php and page content into editable templates; enqueue compiled GSAP/CSS.

**Alternative**: Build React with `npm run build` and enqueue its compiled assets in a WordPress theme, mounting React into `#root` (SPA/headless approach). Requires route fallbacks, WP REST API content integration, and explicit SEO/SSR planning. This ZIP is not an installable WordPress theme.

## Important limitations
- Page section markup is preserved from the V3 static site as JSON and parsed into React; it is not yet individually rewritten into JSX section components.
- External image URLs are temporary examples, not client-owned assets.
- Contact form, WhatsApp, social links, membership details, map and policies need production data.
- The ZIP is source code. The in-chat visual preview is a lightweight design preview, not the Vite development server.
