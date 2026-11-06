# Proximus OS

The interactive Proximus Shev portfolio, built with Next.js 16, React 19, TypeScript, Tailwind CSS, Lucide, and React Icons. Existing case studies remain available at `/projects` and `/projects/[slug]`.

## Local development

```powershell
npm install
npm run dev
```

Open the Local address printed by Next.js. Validate changes with `npm run lint` and `npm run build`. Run `npm start` to preview a completed production build.

## Workspace controls

- Launch an app from the top bar, application rail, or dock. Existing apps come to the foreground.
- Drag desktop title bars; movement stays within the workspace. Double-click a title bar or use the green control to maximize/restore. Yellow minimizes; red closes. Dock indicators distinguish open and minimized apps.
- On small screens, apps use a single full-screen view with a Back button and bottom navigation. Browser Back restores earlier app/project views.
- Ctrl/Cmd + K opens search. Arrow keys select; Enter launches; Escape dismisses.
- The theme toggle respects the initial system theme and saves the selection using the existing `ps-theme` preference.
- Ambient motion pauses in hidden tabs. Settings offers appearance and reduced-effects controls. Reduced-motion preferences disable decorative motion.

After the desktop lock screen, Home reveals portfolio shortcuts, work/contact actions, a featured portfolio build, and a 25-minute focus timer. Selecting Home minimizes open apps to the dock; selecting an app restores its current screen. Every running app has a dock entry, including Resume. A scroll cue appears when the Home content extends below a short viewport. The supplied home wallpapers crossfade with the selected theme.

Phone screens have a dedicated lock screen and home launcher. Swipe up on the lock screen or tap its unlock button; use the theme and contact shortcuts as needed. Home has portfolio shortcuts, app search, appearance and focus widgets, and three selectable pages (Home, Apps, Projects). Its dock opens Home, Contact, and Settings. Both phone screens currently reuse the supplied portrait wallpaper pair. The timer session is shared across desktop and phone layouts.

On phones, Home scrolls inside a fixed screen with space reserved for the dock and device safe areas. The wallpaper uses the large viewport height so Safari toolbar changes do not resize or recrop it. Dedicated case studies retain normal document scrolling.

Direct links use `/?app=projects`, `/?app=contact`, or `/?app=projects&project=ai-study-assistant`. Existing `/#about`, `/#tech-stack`, and `/#contact` links also work.

Unlocking is remembered in session storage so links from project pages return directly to the workspace. The Lock control clears that preference. This is a portfolio interaction, not authentication. Terminal is excluded from navigation, search, URL handling, and rendered windows.

## PS introduction

The compact PS logo appears on pitch black inside a cyan loading ring. The logo fades, then the ring expands to reveal the workspace in approximately 2.6 seconds. It plays once per tab session, with an independent CSS exit and JavaScript timeout. Storage restrictions do not prevent exit. Reduced motion skips the expanding ring.

Replay through Settings or `/?intro=replay`.

## Content and architecture

- `src/components/os/registry.ts`: shared app registry, existing profile information, and technology data.
- `src/components/os/window-state.ts`: central window state, arrangement, and bounds.
- `src/components/os/OSWindow.tsx`: shared window controls and pointer dragging.
- `src/components/os/ProximusOS.tsx`: desktop/mobile shell, history, launchers, dock, and clock.
- `src/components/os/PhoneExperience.tsx` and `phone-experience.css`: phone lock screen, home pages, app launcher, and shared portrait wallpaper styling.
- `src/components/os/FocusTimer.tsx`: shared focus session for desktop and phone widgets.
- `src/components/os/Applications.tsx`: shared portfolio applications and responsive home composition.
- `src/components/os/TerminalApp.tsx`: retained legacy source, not loaded by the active portfolio.
- `src/components/os/CommandPalette.tsx`: searchable keyboard launcher.
- `src/app/proximus-os.css`: scoped dark/light design tokens, responsive styling, and motion.
- `src/data/projects.ts`: source of truth for projects and their statuses.
- `src/components/ProjectPageShell.tsx`, `ProjectHeader.tsx`, and `project-pages.module.css`: shared project-page styling and navigation with explicit light/dark colours.
- `src/app/robots.ts`, `sitemap.ts`, and `opengraph-image.tsx`: crawler routes and the branded social preview.

The previous landing components are retained. The approved PS logo and existing responsive WebP backgrounds are reused. No new runtime dependencies are required.

## Asset limitations

The current checkout contains five planned projects and the portfolio marked in progress. Those statuses are preserved. No resume PDF, project screenshots, or LinkedIn URL are configured. The Resume app provides an email request; project previews use clearly labeled identity artwork or project outlines, and existing case-study links remain functional. Add verified assets and links before presenting them as available.

## Verification

Install the test browsers with `npx playwright install chromium webkit`. Run `npm run build`, then `npx playwright test`. The test runner starts a fresh production preview on port 3100 and saves screenshots and failure traces under the ignored `test-results/` directory. Set `PLAYWRIGHT_BASE_URL` to run against an existing preview or deployment instead. Run `npm run lint` separately.

The 44 general Chromium checks cover eight viewport sizes in light and dark themes, desktop and phone unlocking, the intro with normal and reduced motion, portrait loading and circular frames, appearance persistence, direct links and browser history, dock restoration, window maximize/restore/drag bounds, focus timer continuity, short-screen scrolling, project routes and metadata, branded wallpapers, optimized portrait responses, and crawler/social routes. Eight additional phone checks run in both Chromium and mobile WebKit, covering stationary wallpaper during content scrolling, dock clearance, reachable widgets and projects, unlock/reload, and document scrolling when leaving Home. Automated WebKit coverage does not replace checking Safari's toolbar and safe areas on a physical iPhone; Firefox and real-device performance remain unverified.

Desktop home, window backgrounds, appearance previews, and the focus widget use `home-desktop-ps-dark.webp` and `home-desktop-ps-light.webp`. The original wallpapers remain available; edit prompts are recorded in `output/imagegen/wallpaper-prompts.md`. The profile portrait appears in About and the desktop/phone profile controls.
