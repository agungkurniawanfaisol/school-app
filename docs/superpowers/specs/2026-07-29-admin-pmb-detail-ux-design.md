# Admin PMB Registration Detail UX

**Date:** 2026-07-29  
**Status:** Approved (user: layout + polish, sticky actions on desktop, mobile-first)

## Problem

Admin detail page is a flat stack of cards with weak hierarchy; student photo and payment proof are easy to miss; status actions sit at the bottom after long scroll.

## Solution

1. **Profile header** — avatar photo, name, registration number, status badge, grade + academic year, parent contact (`tel:` / `mailto:`).
2. **Two-column layout (`lg+`)** — main content left; sticky action panel right (status, notes, verify/reject/LoA).
3. **Mobile** — single column; action panel directly under header (`order-1`), then content.
4. **Field display** — label above value; Indonesian labels for draft payload keys.
5. **Payment** — large preview + meta.
6. **Messages** — chat-style bubbles (admin vs pendaftar).

## Out of scope

Backend API changes; list page redesign; new routes.
