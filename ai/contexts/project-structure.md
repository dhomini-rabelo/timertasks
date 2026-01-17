# Project Structure

### Overview of the Project Structure

- ai: AI tasks, prompts, and context documentation for the workspace.
- packages: Monorepo packages container.
- packages/frontend: Frontend workspace dependencies (Tailwind/Vite tooling).
- packages/frontend/timertasks: Vite + React frontend application root.
- packages/frontend/timertasks/dist: Built frontend assets (static output).
- packages/frontend/timertasks/public: Public static assets (logos, audio files).
- packages/frontend/timertasks/src: Application source code.
- packages/frontend/timertasks/src/main.tsx: React application entry point.
- packages/frontend/timertasks/src/App.tsx: App shell that renders the main page.
- packages/frontend/timertasks/src/layout: Shared UI layout and styling.
- packages/frontend/timertasks/src/layout/components: Reusable layout components.
- packages/frontend/timertasks/src/layout/components/atoms: Atomic UI components (Button, Input, etc.).
- packages/frontend/timertasks/src/layout/components/common: Shared composite components (e.g., Timer).
- packages/frontend/timertasks/src/layout/styles: Global styles and theme variables.
- packages/frontend/timertasks/src/code: Shared utility code.
- packages/frontend/timertasks/src/code/utils/date.ts: Date/time helper utilities.
- packages/frontend/timertasks/src/pages: Page-level features.
- packages/frontend/timertasks/src/pages/index: Main index page feature area.
- packages/frontend/timertasks/src/pages/index/components: UI components for the index page (timer, tasks, score).
- packages/frontend/timertasks/src/pages/index/hooks: Hooks for index page behaviors (storage, listing).
- packages/frontend/timertasks/src/pages/index/states: Client state for index page (timer, notifications, tasks).
- packages/frontend/timertasks/src/pages/index/states/tasks: Task domain state and helpers.
- packages/frontend/timertasks/index.html: Vite HTML entry template.
- packages/frontend/timertasks/vite.config.ts: Vite configuration.
- packages/frontend/timertasks/eslint.config.js: ESLint configuration.
- packages/frontend/timertasks/tsconfig.json: Base TypeScript configuration.
- packages/frontend/timertasks/tsconfig.app.json: App TypeScript configuration.
- packages/frontend/timertasks/tsconfig.node.json: Node/tooling TypeScript configuration.
- packages/frontend/timertasks/package.json: Frontend app scripts and dependencies.
- packages/frontend/timertasks/README.md: Frontend app documentation.
