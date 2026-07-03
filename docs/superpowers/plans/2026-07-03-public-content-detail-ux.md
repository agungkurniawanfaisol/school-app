# Public Content Detail UX Enhancement — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tingkatkan halaman detail publik `/berita/detail/:uuid` dan `/kegiatan/detail/:uuid` agar lebih menarik, konsisten dengan halaman guru/fasilitas, mobile-first, dan accessible (Radix/shadcn patterns).

**Architecture:** Ekstrak layout artikel bersama (`ArticleDetailLayout`) dipakai oleh `NewsDetailPage` dan `ActivityDetailPage`. Hero visual + meta bar + konten dalam card elevated + bagian "Baca juga" + tombol bagikan WhatsApp. Tidak mengubah token warna global (tetap hijau sekolah); tipografi editorial via `prose` + spacing hierarchy yang sudah ada.

**Tech Stack:** React 18, TypeScript, Radix/shadcn, Tailwind v4, TanStack Query, Lucide icons, existing `BlockRenderer` + `PageMeta` + `openWhatsAppShare`.

---

## Konteks & Masalah Saat Ini

| Halaman | File | Masalah |
|---------|------|---------|
| Berita | `frontend/src/pages/news/NewsDetailPage.tsx` | Layout datar: ghost back, badge + tanggal, judul, gambar, excerpt, konten — tanpa hero, share, related, atau visual hierarchy |
| Kegiatan | `frontend/src/pages/activities/ActivityDetailPage.tsx` | Sama seperti berita; **tanpa `PageMeta`** (SEO buruk) |

**Referensi baik di codebase:**
- `TeacherPublicDetailPage.tsx` — toolbar back + share, hierarchy jelas
- `FacilityPublicDetailPage.tsx` — hero image, badge, section spacing
- Landing cards (`NewsSection`, `ActivitiesSection`) — visual language yang harus dilanjutkan di detail

**UX priorities (ui-ux-pro-max / Radix):**
1. Accessibility: focus rings, aria-labels pada share/back, kontras teks
2. Touch: tombol min-h-11, spacing 8px+
3. Mobile-first: hero responsif, tidak horizontal scroll
4. Feedback: skeleton mirip layout final, error state jelas
5. `prefers-reduced-motion`: hindari animasi dekoratif berlebihan

---

## File Map

| File | Aksi | Tanggung jawab |
|------|------|----------------|
| `frontend/src/components/content/ArticleDetailLayout.tsx` | **Create** | Shell: hero, toolbar, meta, excerpt lead, content card, share |
| `frontend/src/components/content/RelatedContentCards.tsx` | **Create** | Grid 2–3 kartu "Baca juga" |
| `frontend/src/lib/reading-time.ts` | **Create** | Estimasi menit baca dari HTML/plain text |
| `frontend/src/pages/news/NewsDetailPage.tsx` | **Modify** | Pakai layout + related news |
| `frontend/src/pages/activities/ActivityDetailPage.tsx` | **Modify** | Pakai layout + PageMeta + related activities |
| `frontend/src/pages/news/NewsDetailPage.test.tsx` | **Create** | Render meta, share, related |
| `frontend/src/pages/activities/ActivityDetailPage.test.tsx` | **Create** | PageMeta + layout |

---

## Task 1: Reading time utility

**Files:**
- Create: `frontend/src/lib/reading-time.ts`
- Test: `frontend/src/lib/reading-time.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// frontend/src/lib/reading-time.test.ts
import { describe, expect, it } from 'vitest'
import { estimateReadingTimeMinutes } from '@/lib/reading-time'

describe('estimateReadingTimeMinutes', () => {
  it('returns at least 1 minute for non-empty text', () => {
    const words = Array.from({ length: 250 }, () => 'kata').join(' ')
    expect(estimateReadingTimeMinutes(words)).toBeGreaterThanOrEqual(1)
  })

  it('returns 0 for empty input', () => {
    expect(estimateReadingTimeMinutes('')).toBe(0)
    expect(estimateReadingTimeMinutes(null)).toBe(0)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd frontend && npm run test -- --run src/lib/reading-time.test.ts`  
Expected: FAIL — module not found

- [ ] **Step 3: Write minimal implementation**

```typescript
// frontend/src/lib/reading-time.ts
const WORDS_PER_MINUTE = 200

export function estimateReadingTimeMinutes(text: string | null | undefined): number {
  if (!text?.trim()) return 0
  const plain = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  const words = plain.split(' ').filter(Boolean).length
  if (words === 0) return 0
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd frontend && npm run test -- --run src/lib/reading-time.test.ts`  
Expected: PASS

---

## Task 2: ArticleDetailLayout component

**Files:**
- Create: `frontend/src/components/content/ArticleDetailLayout.tsx`

- [ ] **Step 1: Create layout with props interface**

```tsx
// frontend/src/components/content/ArticleDetailLayout.tsx
import { Calendar, Clock, Share2, Tag, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { openWhatsAppShare } from '@/lib/share'
import { estimateReadingTimeMinutes } from '@/lib/reading-time'

export interface ArticleDetailMetaItem {
  icon?: 'calendar' | 'clock' | 'user' | 'tag'
  label: string
}

export interface ArticleDetailLayoutProps {
  backHref: string
  backLabel: string
  title: string
  excerpt?: string | null
  thumbnail?: string | null
  category?: string | null
  authorName?: string | null
  dateLabel?: string | null
  readingSource?: string | null
  shareTitle: string
  children: React.ReactNode
  footer?: React.ReactNode
}

const iconMap = {
  calendar: Calendar,
  clock: Clock,
  user: User,
  tag: Tag,
} as const

export function ArticleDetailLayout({
  backHref,
  backLabel,
  title,
  excerpt,
  thumbnail,
  category,
  authorName,
  dateLabel,
  readingSource,
  shareTitle,
  children,
  footer,
}: ArticleDetailLayoutProps) {
  const pageUrl = typeof window !== 'undefined' ? window.location.href : ''
  const readingMinutes = estimateReadingTimeMinutes(readingSource ?? excerpt ?? '')

  return (
    <article className="pb-16">
      {/* Hero */}
      <div className="relative border-b border-primary/10 bg-gradient-to-br from-primary/10 via-background to-secondary/30">
        <div className="container-page py-6 sm:py-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <Button asChild variant="ghost" size="sm" className="min-h-11">
              <Link to={backHref}>← {backLabel}</Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="min-h-11 gap-2"
              aria-label="Bagikan via WhatsApp"
              onClick={() => openWhatsAppShare(shareTitle, pageUrl)}
            >
              <Share2 className="h-4 w-4" aria-hidden />
              Bagikan
            </Button>
          </div>

          <div className="mx-auto max-w-4xl space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              {category && (
                <Badge variant="secondary" className="capitalize">
                  <Tag className="mr-1 h-3 w-3" aria-hidden />
                  {category}
                </Badge>
              )}
              {dateLabel && (
                <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" aria-hidden />
                  {dateLabel}
                </span>
              )}
              {readingMinutes > 0 && (
                <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" aria-hidden />
                  {readingMinutes} menit baca
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
              {title}
            </h1>

            {authorName && (
              <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" aria-hidden />
                Oleh {authorName}
              </p>
            )}

            {excerpt && (
              <p className="text-lg leading-relaxed text-muted-foreground sm:text-xl">{excerpt}</p>
            )}
          </div>
        </div>

        {thumbnail && (
          <div className="container-page pb-8">
            <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-primary/10 shadow-lg">
              <img
                src={thumbnail}
                alt=""
                className="aspect-[21/9] w-full object-cover sm:aspect-video"
                loading="eager"
              />
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="container-page section-padding pt-8 sm:pt-10">
        <div className="mx-auto max-w-3xl">
          <Card className="border-primary/10 shadow-sm">
            <CardContent className="p-5 sm:p-8 lg:p-10">
              <div className="prose prose-neutral max-w-none dark:prose-invert">{children}</div>
            </CardContent>
          </Card>
          {footer}
        </div>
      </div>
    </article>
  )
}
```

- [ ] **Step 2: Verify build**

Run: `cd frontend && npm run build` (atau `npx tsc -b` jika build penuh gagal di file lain)  
Expected: no errors in new files

---

## Task 3: RelatedContentCards component

**Files:**
- Create: `frontend/src/components/content/RelatedContentCards.tsx`

- [ ] **Step 1: Create related cards section**

```tsx
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'

export interface RelatedContentItem {
  uuid: string
  title: string
  excerpt?: string | null
  thumbnail?: string | null
  category?: string | null
  dateLabel?: string | null
  href: string
}

interface RelatedContentCardsProps {
  title?: string
  items: RelatedContentItem[]
  viewAllHref?: string
  viewAllLabel?: string
}

export function RelatedContentCards({
  title = 'Baca juga',
  items,
  viewAllHref,
  viewAllLabel = 'Lihat semua',
}: RelatedContentCardsProps) {
  if (items.length === 0) return null

  return (
    <section className="mt-10 space-y-4" aria-labelledby="related-content-heading">
      <div className="flex items-center justify-between gap-3">
        <h2 id="related-content-heading" className="text-lg font-semibold">
          {title}
        </h2>
        {viewAllHref && (
          <Link
            to={viewAllHref}
            className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            {viewAllLabel}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <Link key={item.uuid} to={item.href} className="group block">
            <Card className="card-hover h-full overflow-hidden border-primary/10 transition-colors hover:border-primary/30">
              {item.thumbnail && (
                <img
                  src={item.thumbnail}
                  alt=""
                  className="aspect-video w-full object-cover"
                  loading="lazy"
                />
              )}
              <CardHeader className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  {item.category && (
                    <Badge variant="secondary" className="capitalize">
                      {item.category}
                    </Badge>
                  )}
                  {item.dateLabel && (
                    <span className="text-xs text-muted-foreground">{item.dateLabel}</span>
                  )}
                </div>
                <CardTitle className="line-clamp-2 text-base leading-snug group-hover:text-primary">
                  {item.title}
                </CardTitle>
                {item.excerpt && (
                  <CardDescription className="line-clamp-2">{item.excerpt}</CardDescription>
                )}
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
```

---

## Task 4: Refactor NewsDetailPage

**Files:**
- Modify: `frontend/src/pages/news/NewsDetailPage.tsx`
- Create: `frontend/src/pages/news/NewsDetailPage.test.tsx`

- [ ] **Step 1: Write failing test**

```tsx
// frontend/src/pages/news/NewsDetailPage.test.tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { NewsDetailPage } from '@/pages/news/NewsDetailPage'

vi.mock('@/hooks/useNews', () => ({
  useNewsDetailByUuid: () => ({
    data: {
      id: 1,
      uuid: 'test-uuid',
      school_id: 1,
      title: 'Berita Penting',
      slug: 'berita-penting',
      excerpt: 'Ringkasan berita',
      content: '<p>Konten</p>',
      thumbnail: '/img.jpg',
      category: 'umum',
      published_at: '2026-01-01T00:00:00Z',
      author: { id: 1, name: 'Admin' },
      order: 0,
      is_active: true,
      is_featured: true,
    },
    isLoading: false,
    isError: false,
  }),
  useNewsList: () => ({ data: { data: [] } }),
}))

describe('NewsDetailPage', () => {
  it('renders enhanced layout elements', () => {
    render(
      <MemoryRouter initialEntries={['/berita/detail/test-uuid']}>
        <Routes>
          <Route path="/berita/detail/:uuid" element={<NewsDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { level: 1, name: 'Berita Penting' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /bagikan/i })).toBeInTheDocument()
    expect(screen.getByText(/menit baca/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test — expect FAIL**

Run: `cd frontend && npm run test -- --run src/pages/news/NewsDetailPage.test.tsx`

- [ ] **Step 3: Implement NewsDetailPage**

```tsx
// frontend/src/pages/news/NewsDetailPage.tsx — struktur utama
import { useParams } from 'react-router-dom'
import { BlockRenderer } from '@/components/editor/BlockRenderer'
import { ArticleDetailLayout } from '@/components/content/ArticleDetailLayout'
import { RelatedContentCards } from '@/components/content/RelatedContentCards'
import { PageMeta } from '@/components/seo/PageMeta'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Link } from 'react-router-dom'
import { useNewsDetailByUuid, useNewsList } from '@/hooks/useNews'
import { formatDate } from '@/lib/utils'

export function NewsDetailPage() {
  const { uuid } = useParams<{ uuid: string }>()
  const { data: news, isLoading, isError } = useNewsDetailByUuid(uuid ?? '')
  const { data: relatedData } = useNewsList({
    per_page: 4,
    category: news?.category ?? undefined,
  })

  // loading + error states: skeleton dengan hero placeholder (tinggi ~48)

  const related = (relatedData?.data ?? [])
    .filter((item) => item.uuid !== uuid)
    .slice(0, 3)
    .map((item) => ({
      uuid: item.uuid,
      title: item.title,
      excerpt: item.excerpt,
      thumbnail: item.thumbnail,
      category: item.category,
      dateLabel: item.published_at ? formatDate(item.published_at) : null,
      href: `/berita/detail/${item.uuid}`,
    }))

  return (
    <>
      <PageMeta title={news.title} description={news.excerpt ?? undefined} />
      <ArticleDetailLayout
        backHref="/#berita"
        backLabel="Berita"
        title={news.title}
        excerpt={news.excerpt}
        thumbnail={news.thumbnail}
        category={news.category}
        authorName={news.author?.name}
        dateLabel={news.published_at ? formatDate(news.published_at) : null}
        readingSource={news.content ?? news.excerpt}
        shareTitle={news.title}
        footer={
          <RelatedContentCards
            items={related}
            viewAllHref="/#berita"
            viewAllLabel="Semua berita"
          />
        }
      >
        <BlockRenderer contentJson={news.content_json} contentHtml={news.content} />
      </ArticleDetailLayout>
    </>
  )
}
```

(Lengkapi loading/error skeleton sebelum return utama — copy pola dari `FacilityPublicDetailPage`.)

- [ ] **Step 4: Run test — expect PASS**

---

## Task 5: Refactor ActivityDetailPage

**Files:**
- Modify: `frontend/src/pages/activities/ActivityDetailPage.tsx`
- Create: `frontend/src/pages/activities/ActivityDetailPage.test.tsx`

- [ ] **Step 1: Write failing test** — assert `PageMeta` via document title atau mock; assert "Bagikan" button

- [ ] **Step 2: Implement** — mirror NewsDetailPage:
  - `PageMeta` dengan `activity.title` + `activity.excerpt`
  - `backHref="/#kegiatan"`, `backLabel="Kegiatan"`
  - `dateLabel` dari `activity.activity_date`
  - `useActivitiesList({ per_page: 4, category })` untuk related
  - `shareTitle={`Kegiatan: ${activity.title}`}`

- [ ] **Step 3: Run tests**

Run: `cd frontend && npm run test -- --run src/pages/activities/ActivityDetailPage.test.tsx src/pages/news/NewsDetailPage.test.tsx`

---

## Task 6: Polish & accessibility pass

**Files:**
- Modify: `frontend/src/components/content/ArticleDetailLayout.tsx`
- Modify: `frontend/src/index.css` (hanya jika perlu utility kecil)

- [ ] **Step 1:** Hero image `alt=""` jika dekoratif (judul sudah di h1); atau `alt={title}` jika meaningful
- [ ] **Step 2:** Pastikan focus visible pada Link/Button (shadcn default)
- [ ] **Step 3:** Tambah `@media (prefers-reduced-motion: reduce)` — nonaktifkan `card-hover` transform jika ada di related cards (gunakan class existing)
- [ ] **Step 4:** Manual test di viewport 375px:
  - `/berita/detail/:uuid`
  - `/kegiatan/detail/:uuid`
  - Tombol back & share mudah dijangkau
  - Tidak ada horizontal scroll

---

## Task 7: Verification

- [ ] **Run frontend tests**

```bash
cd frontend && npm run test -- --run src/lib/reading-time.test.ts src/pages/news/NewsDetailPage.test.tsx src/pages/activities/ActivityDetailPage.test.tsx src/components/editor/BlockRenderer.test.tsx
```

Expected: all PASS

- [ ] **Visual check** — bandingkan sebelum/sesudah di localhost:5173

---

## Out of Scope (YAGNI)

- Font baru (Newsreader) — tetap pakai `--font-heading` existing
- Halaman list `/berita` terpisah (masih anchor `/#berita`)
- Dark mode khusus hero — mengikuti theme global
- Native Web Share API — cukup WhatsApp seperti halaman guru

---

## Self-Review (spec coverage)

| Requirement | Task |
|-------------|------|
| Detail berita lebih menarik | Task 2, 4 |
| Detail kegiatan sama | Task 5 |
| Radix/shadcn (Button, Card, Badge) | Task 2, 3 |
| Mobile-first + a11y | Task 6 |
| SEO activity | Task 5 (PageMeta) |
| Share | Task 2 |
| Related content | Task 3, 4, 5 |
| DRY antara berita & kegiatan | Task 2 |

**Placeholder scan:** tidak ada TBD/TODO dalam task steps.

---

## Execution Handoff

**Plan complete and saved to `docs/superpowers/plans/2026-07-03-public-content-detail-ux.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
