import type { ReactNode } from 'react'

interface PreviewFrameProps {
  title: string
  isDraft?: boolean
  children: ReactNode
  toolbar?: ReactNode
}

export function PreviewFrame({ title, isDraft, children, toolbar }: PreviewFrameProps) {
  return (
    <div className="min-h-dvh bg-background">
      {isDraft && (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
          Pratinjau — konten ini belum dipublikasikan.
        </div>
      )}
      <header className="border-b bg-card px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-lg font-semibold sm:text-xl">{title}</h1>
          {toolbar && <div className="flex flex-wrap gap-2">{toolbar}</div>}
        </div>
      </header>
      <main className="container-page section-padding">
        <div className="mx-auto max-w-4xl">{children}</div>
      </main>
    </div>
  )
}
