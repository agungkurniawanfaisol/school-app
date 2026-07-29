# Sales Presentation Build Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished client-facing sales presentation for `Nurul Hikmah App` that positions the product as a long-term school digital investment.

**Architecture:** Create a standalone HTML slide deck with embedded CSS and JavaScript so the presentation can be opened locally without extra tooling. Use persuasive sales copy, a simplified architecture diagram, and internet-sourced visual assets that support a formal, modern, Islami-elegant tone.

**Tech Stack:** HTML, CSS, vanilla JavaScript, remote stock image URLs, existing project product context

## Global Constraints
- UI copy must be in Bahasa Indonesia.
- The deck must emphasize strengths much more than weaknesses.
- The architecture explanation must remain non-technical and client-friendly.
- The presentation must feel formal, modern, and Islami-elegant.
- The output should be directly usable in a client meeting.

---

### Task 1: Create the presentation artifact

**Files:**
- Create: `docs/presentations/nurul-hikmah-app-sales-deck.html`
- Modify: `docs/superpowers/plans/2026-07-16-sales-presentation-build.md`

**Interfaces:**
- Consumes: `docs/superpowers/specs/2026-07-16-sales-presentation-design.md`
- Produces: a standalone slide deck with keyboard and click navigation

- [ ] **Step 1: Draft the slide sequence and persuasive copy**

```text
Slides:
1. Cover
2. Masalah sekolah saat ini
3. Solusi terintegrasi
4. Modul utama
5. Kelebihan utama
6. Arsitektur sistem
7. Dampak untuk sekolah
8. Perbandingan cara lama vs sistem digital
9. Catatan implementasi
10. Mengapa sekarang
11. Nilai investasi jangka panjang
12. Closing CTA
```

- [ ] **Step 2: Build the standalone HTML deck**

```html
<!DOCTYPE html>
<html lang="id">
  <head>...</head>
  <body>
    <div class="progress-bar" id="progressBar"></div>
    <div class="slide-deck">
      <section class="slide active">...</section>
    </div>
    <script>
      function showSlide(index) { /* update active slide */ }
    </script>
  </body>
</html>
```

- [ ] **Step 3: Add visual sections for credibility**

```html
<div class="architecture-flow">
  <div class="flow-node">Pengunjung & Orang Tua</div>
  <div class="flow-arrow">→</div>
  <div class="flow-node">Website & PPDB Online</div>
</div>
```

- [ ] **Step 4: Verify the file structure and readability**

Run: open the HTML locally in a browser-compatible preview path and inspect that all slides render with working navigation.
Expected: all slides visible one at a time, no overflow on desktop viewport, images load, and copy is readable.

### Task 2: Record image sourcing and final usage notes

**Files:**
- Create: `docs/presentations/nurul-hikmah-app-sales-deck-sources.md`
- Modify: `docs/presentations/nurul-hikmah-app-sales-deck.html`

**Interfaces:**
- Consumes: internet research results gathered during planning
- Produces: image source notes and presentational usage guidance

- [ ] **Step 1: Write the source note document**

```md
# Image Sources

- Pexels photo page: ...
- Pexels photo page: ...
```

- [ ] **Step 2: Add a small source note in the closing slide or document footer**

```html
<p class="source-note">Visual referensi menggunakan gambar bebas pakai dari Pexels.</p>
```

- [ ] **Step 3: Final review**

Run: manually review copy for exaggerated claims, spelling, and tone consistency.
Expected: persuasive but professional language with no misleading guarantee wording.
