# Admin PMB Detail UX Implementation Plan

> **For agentic workers:** Implement task-by-task. Frontend only.

**Goal:** Redesign admin PMB registration detail for clearer review workflow and mobile support.

**Architecture:** Single page refactor under `AdminFormShell`; sticky action aside on `lg+`; stack with actions-first on mobile.

**Tech Stack:** React, Tailwind, existing admin/shadcn components, Vitest.

## Tasks

- [x] Update Vitest for profile header + action panel + media previews
- [x] Implement redesigned `PmbRegistrationDetailPage.tsx`
- [x] Run frontend tests for the page
