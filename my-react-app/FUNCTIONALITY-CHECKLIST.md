# Portfolio Functionality Checklist

Audit date: 2026-11-11

## Test scope

No browser automation tool or installed browser executable was available in this environment. The portfolio could not be opened for desktop or mobile click-through testing, so rendered behavior, browser console output, touch behavior, and external navigation remain unverified. Source checks and the production build were run; they do not establish that every interaction works at runtime.

## Static checks

- **PASS** — `npm run build` completed successfully with Vite.
- **PASS** — `node --check script.js` and `node --check location.js` completed successfully.
- **PASS** — all 17 internal fragment links point to an existing section or element; no duplicate IDs were found among 36 IDs.
- **PASS** — no empty `href` attributes were found.
- **PASS** — `public/profile.jpg` exists and is non-empty.
- **PASS** — the supplied LinkedIn and Instagram handles and contact email are present in the portfolio links/contact code.
- **PASS** — the contact form has a configured `mailto:` recipient and a guard against an empty recipient.
- **PASS** — source inspection found event handlers for the listed interactive controls below. This confirms wiring is present, not that those controls were exercised successfully.
- **NOT TESTED** — browser console errors, failed network requests, broken rendered assets, runtime exceptions, and unresolved asynchronous work.

## Runtime interaction checklist

Every item below is **NOT TESTED** because no browser was available. Source inspection found the corresponding targets or handlers where noted.

### Navigation and scrolling

- **NOT TESTED** — wordmark, header navigation, hero CTAs, scroll cue, footer links, and command-center links navigate to the intended sections. Their fragment targets pass the static anchor check.
- **NOT TESTED** — smooth scrolling and automatic active-section indication while scrolling down and up.
- **NOT TESTED** — mobile menu opens, closes, updates its accessibility state, and navigates correctly.
- **NOT TESTED** — command-center launcher, close button, Escape dismissal, and section links.
- **NOT TESTED** — scroll-reveal animations, reverse transitions, pointer effects, and reduced-motion behavior.

### Dimension lab and scene controls

- **NOT TESTED** — sculpture drag rotation, Shift-drag movement, keyboard movement, and reset view.
- **NOT TESTED** — ORBIT, PRISM, and RIPPLE shape selectors update the rendered object.
- **NOT TESTED** — CHROME, SILVER, CRYSTAL, GLASS, LAVENDER, and LIME selectors update the rendered material.
- **NOT TESTED** — ORBITAL, CAUSTIC, and PORTAL selectors update the rendered scene.
- **NOT TESTED** — particle intensity and motion tempo sliders change the scene as intended.
- **NOT TESTED** — sculpture rendering, lighting, reflections, shadows, resize behavior, and mobile touch interaction.
- **NOT TESTED** — visual sound-reactor toggle. The UI identifies this as a visual waveform and states that it has no microphone or audio playback.

### Portfolio sections and companions

- **NOT TESTED** — journey timeline tabs update their detail panel and support keyboard navigation.
- **NOT TESTED** — skill cards open the correct detail dialog; close button, Escape, and outside-click dismissal.
- **NOT TESTED** — globe drag, wheel zoom, recenter, zoom buttons, resize, and touch interaction.
- **NOT TESTED** — location companion visibility toggle and NOVA/PIXEL pointer, click, and keyboard interactions.
- **NOT TESTED** — project preview card interactions and ZezoMart live-preview destination.
- **NOT TESTED** — GitHub, LinkedIn (`ashokjangid023`), and Instagram (`ashujangid_0001`) links open the intended profiles. The GitHub account was checked through its public API in the preceding audit; browser navigation was not tested.
- **NOT TESTED** — local portfolio guide suggestions, typed questions, responses, open/close controls, and error handling. The UI describes it as a local portfolio guide, not an external AI service.
- **NOT TESTED** — portrait fallback behavior and the triple-click lab easter egg.

### Contact and responsive behavior

- **NOT TESTED** — required-field and email validation, invalid-field focus, and feedback states.
- **NOT TESTED** — valid contact submission opens the user's email application with `ashokjangid023@gmail.com`, the message subject, and body. The address and `mailto:` construction are present in source.
- **NOT TESTED** — responsive layouts at desktop, tablet, and mobile sizes; horizontal overflow; target sizes; and mobile touch interactions.
- **NOT TESTED** — keyboard focus order, accessibility announcements, and external links in the rendered page.

## Findings addressed in this pass

- Replaced the LinkedIn homepage URL with the profile URL formed from the handle supplied by the user.
- Added the supplied Instagram profile to the contact links.
- Configured the contact form's `mailto:` recipient with the supplied email and clarified its post-submit message so it does not imply that an email was sent automatically.
- Added a guard and clear feedback for an unconfigured recipient.
- Pointed both portfolio GitHub links to `ashokjangid023` for consistency with the current contact link.
- Added wrapping and spacing for the three contact profile links on narrow layouts.

No runtime failures were identified because runtime browser testing was unavailable. The **NOT TESTED** items require an actual browser pass before the site can be certified end to end.
